"""
Human driven dispersal rules
"""
abstract type AbstractHumanDispersal <: AbstractPartialRule end

"""
HumanDispersal Rules human-driven dispersal patterns using population data.

Transport connections between grid cells are calculated using distance and human population,
modified with the `human_exponent` and `dist_exponent` parameters. A shortlist of the most
connected cells is selected for use in the simulation.

The time taken for precalulation will depend on the `scale` argument. Values above 1
will downsample the grid to improve precalulation time and runtime performance. A high
scale value is good for use in a live interface.
$(FIELDDOCTABLE)
"""
@description @limits @flattenable struct HumanDispersal{HP,CS,S,AG,HE,DE,EA,MD,SL,TS,PC,PR,DP} <: AbstractHumanDispersal
    # Field                | Flatten | Limits
    human_pop::HP          | false   | _               | _
    cellsize::CS           | false   | _               | _
    scale::S               | false   | _               | _
    aggregator::AG         | false   | _               | "A function that aggregates scaled down cells"
    human_exponent::HE     | true    | (1.0, 3.0)      | "Human population exponent"
    dist_exponent::DE      | true    | (1.0, 3.0)      | "Distance exponent"
    dispersalperactivity::EA  | true | (0.0, 1e-8)     | "Scales the number of dispersing individuals by human activity (ie population^human_exponent)"
    max_dispersers::MD     | true    | (50.0, 10000.0) | "Maximum number of dispersers in a dispersal events"
    shortlist_len::SL      | false   | _               | "Length of precalc shortlist"
    timestep::TS           | false   | _               | _
    precalc::PC            | false   | _               | _
    proportion_covered::PR | false   | _               | _
    dispersal_probs::DP    | false   | _               | _
    function HumanDispersal{HP,CS,S,AG,HE,DE,PA,MD,SL,TS,PC,PR,DP}(human_pop::HP, cellsize::CS, scale::S, aggregator::AG,
                    human_exponent::HE, dist_exponent::DE, dispersalperactivity::PA, max_dispersers::MD, shortlist_len::SL, timestep::TS,
                    precalc::PC, proportion_covered::PR, dispersal_probs::DP
                  ) where {HP,CS,S,AG,HE,DE,PA,MD,SL,TS,PC,PR,DP}
        precalc, proportion_covered = precalc_human_dispersal(human_pop, cellsize, scale, aggregator,
                                          human_exponent, dist_exponent, shortlist_len)
        dispersal_probs = precalc_dispersal_probs(human_pop, dispersalperactivity, timestep)
        pc, pr, dp = typeof.((precalc, proportion_covered, dispersal_probs))
        new{HP,CS,S,AG,HE,DE,PA,MD,SL,TS,pc,pr,dp}(human_pop, cellsize, scale, aggregator, human_exponent,
                                 dist_exponent, dispersalperactivity, max_dispersers, shortlist_len, timestep, precalc,
                                 proportion_covered, dispersal_probs)
    end
end

HumanDispersal(human_pop::HP, cellsize::CS, scale::S, aggregator::AG, human_exponent::HE,
               dist_exponent::DE, dispersalperactivity::PA, max_dispersers::MD, shortlist_len::SL,
               timestep::TS, precalc::PC, proportion_covered::PR, dispersal_probs::DP
              ) where {HP,CS,S,AG,HE,DE,PA,MD,SL,TS,PC,PR,DP} = begin
    HumanDispersal{HP,CS,S,AG,HE,DE,PA,MD,SL,TS,PC,PR,DP}(human_pop, cellsize, scale, aggregator, human_exponent,
                                 dist_exponent, dispersalperactivity, max_dispersers, shortlist_len, timestep, precalc,
                                 proportion_covered, dispersal_probs)
end

HumanDispersal(human_pop; cellsize=1.0, scale=4, aggregator=mean,
               human_exponent=1.0, dist_exponent=1.0, dispersalperactivity=1e-3,
               max_dispersers=100.0, shortlist_len=100, timestep=1) = begin
    precalc, proportion_covered, dispersal_probs = [], [], []
    HumanDispersal(human_pop, cellsize, scale, aggregator, human_exponent,
                   dist_exponent, dispersalperactivity, max_dispersers, shortlist_len, timestep, precalc,
                   proportion_covered, dispersal_probs)
end



" CellGravity allows sorting on gravity while keeping records of the original cell coordinate "
mutable struct CellGravity{M,I}
    gravity::M
    index::I
end

"""
CellGravity allows ordering a list by the cumulative proportion of the total gravity,
and plotting based on the fraction of total gravity.
"""
struct CellInterval{P,M,I}
    cumprop::P
    fraction::P
    gravity::M
    index::I
end

########################################################################################
# Sorting
#
# isless is used to teratively sort lists and search in funcitons like
# searchsortedfirst() and partialsort!
# we define isless on CellGravity.gravity in order to sort margnitudes in order.
# maintaining proportion when using searchsortedfirst.

import Base: isless, +
isless(x::CellGravity, y::CellGravity) = isless(x.gravity, y.gravity)
isless(x::CellGravity, y) = isless(x.gravity, y)
isless(x, y::CellGravity) = isless(x, y.gravity)

isless(x::CellInterval, y::CellInterval) = isless(x.cumprop, y.cumprop)
isless(x::CellInterval, y) = isless(x.cumprop, y)
isless(x, y::CellInterval) = isless(x, y.cumprop)

# Adding methods for + allows us to use sum() on arrays of CellGravity
+(x::CellGravity, y::CellGravity) = +(x.gravity, y.gravity)
+(x, y::CellGravity) = +(x, y.gravity)
+(x::CellGravity, y) = +(x.gravity, y)


# Define types used in the precalculation
const Index = Tuple{Int16,Int16}
const Interval = CellInterval{Float32,Float32,Index}
const Gravity = CellGravity{Float32,Index}
const Precalc = Union{Vector{Interval},Missing}
const Prop = Union{Float32,Missing}

"""
Precalculate a dispersal shortlist for each cell
"""
precalc_human_dispersal(human_pop::AbstractMatrix, cellsize, scale, aggregator,
                        human_exponent, dist_exponent, shortlist_len) = begin

    # Downsample and get final matrix dimensions
    downsampled_pop = downsample(human_pop, aggregator, scale)
    h, w = size(downsampled_pop)

    # Prepare data for processing
    data = setup_data(downsampled_pop, cellsize, shortlist_len, human_exponent, dist_exponent)

    Threads.@threads for j = 1:w
        precalc_col!(data, j)
    end

    shortlist_len, indices, human, dist, precalcs, proportion_covered = data

    precalcs, proportion_covered
end

"""
Prepare all data and allocated required memory for precalculation
"""
function setup_data(human_pop, cellsize, shortlist_len, human_exponent, dist_exponent)
    h, w = size(human_pop)
    # Precalculate exponentiation of human population matrix
    human = human_pop .^ human_exponent
    # Precalculated distances matrix
    dist::Array{Float32,2} = (distances(human_pop) .* cellsize) .^ dist_exponent
    dist[1] = cellsize/6 * (sqrt(2) + log(1 + sqrt(2))) # mean distance from cell centre
    # Get indices to broadcast over
    indices = broadcastable_indices(Int32, human)

    # Limit shortlist cells to the total available
    shortlist_len = min(shortlist_len, length(human))

    # Preallocate memory

    precalcs = Precalc[Vector{Interval}(undef, shortlist_len) for i in 1:h, j in 1:w]
    # Allocate a matrix of shortlist coverage proportions, for diagnostics
    proportion_covered = Prop[0 for i in 1:h, j in 1:w]

    shortlist_len, indices, human, dist, precalcs, proportion_covered
end


"""
Precalculate human dispersal shortlist for every cell in a column.
Working on columns are the cleanest way to separate the work accross multiple processors.
"""
function precalc_col!(data, j)
    shortlist_len, indices, human, dist, precalcs, proportion_covered = data
    h, w = size(human)

    gravities = Matrix{Gravity}(undef, size(human)...)
    broadcast!(index -> Gravity(0.0f0, index), gravities, indices)
    gravity_vector = Vector{Gravity}(undef, h * w)
    gravity_shortlist = Vector{Gravity}(undef, shortlist_len)
    interval_shortlist = Vector{Interval}(undef, shortlist_len)

    @inbounds for i = 1:h
        cumprop = 0.0f0
        if ismissing(human[i, j])
            precalcs[i, j] = missing
            # Update shortlist proportion matrix to check coverage of the distribution
            proportion_covered[i, j] = missing
            continue
        end
        # Calculate the gravity for all cells in the grid
        for ii = 1:h, jj = 1:w
            gravities[ii, jj].gravity = if ismissing(human[ii, jj])
                # Missing values are assigned a negative gravity to miss the shortlist
                -1one(gravities[1, 1].gravity)
            else
                build_gravity_index(i, j, ii, jj, human, dist)
            end
        end
        # broadcast(build_gravity_index, gravities, i, j, indices, (human,), (dist,)) # 4

        # Arrange gravities in a vector for 1 dimensional sorting
        for n = 1:size(gravities, 1) * size(gravities, 2)
            gravity_vector[n] = gravities[n]
        end
        # Sort the top shortlist_len gravities in-place, highest first.
        partialsort!(gravity_vector, shortlist_len, rev=true)
        # Copy sorted gravities to the shortlist
        gravity_shortlist .= gravity_vector[1:shortlist_len]

        # Sum gravities in the shortlist
        shortlist_sum::Float32 = sum(gravity_shortlist)
        # Sum all gravities
        total_sum::Float32 = sum(gravities)

        # Create a list of intervals from the sorted list of gravities.
        # This will be used to choose to randomly select cells from the
        # distribution of gravities
        for (n, m) = enumerate(reverse(gravity_shortlist))
            # Calculaate proportion of current gravity in the complete shortlist
            prop = m.gravity / shortlist_sum
            # Track cumulative proportion for use with `searchsortedfirst()`
            cumprop += prop
            interval_shortlist[n] = CellInterval(cumprop, prop, m.gravity, m.index)
        end
        prop = shortlist_sum / total_sum
        # Update output matrix
        precalcs[i, j] = deepcopy(interval_shortlist)
        # Update shortlist proportion matrix to check coverage of the distribution
        proportion_covered[i, j] = prop
    end
end

"""
Calculate the gravity of an individual cell relative to the current cell.

This is a combination of the distance and population of the cell.
"""
build_gravity_index(i, j, ii, jj, human, dist) =
    @inbounds return (human[i, j] * human[ii, jj]) / (dist[abs(i - ii) + 1, abs(j - jj) + 1])

"""
Populate a matrix from a shortlist of cells from one cell in the precalculated matrix
This lets you view the contents of a cell in an AbstractOutput display.

## Arguments:
`a`: A matrix of the same size the precalculation was performed on
`cells`: A vector of [`CellInterval`](@ref)
"""
populate!(a::AbstractMatrix, cells::Missing, scale) = a
populate!(a::AbstractMatrix, cells::AbstractVector{<:CellInterval}, scale) = begin
    for cell in cells
        a[upsample_index(cell.index, scale)...] = populate_val(a, cell)
    end
    a
end

populate_val(a::AbstractMatrix{<:Integer}, cell) = 1
populate_val(a::AbstractMatrix, cell) = cell.fraction

populate(cells, sze, scale) = populate!(zeros(Float64, sze), cells, scale)


" Prealculate dispersal probailities for use in the rule "
precalc_dispersal_probs(human_pop, dispersalperactivity, timestep) =
    (1 .- 1 ./ exp.(human_pop .* dispersalperactivity)) ./ timestep

"""
    applyrule(rule::AbstractHumanDispersal, data, state, index)
Simulates human dispersal, weighting dispersal probability based on human
population in the source cell.
"""
applyrule!(rule::AbstractHumanDispersal, data, state, index) = begin
    # Ignore empty cells
    state == zero(state) && return

    @inbounds dispersalprob = rule.dispersal_probs[index...]
    ismissing(dispersalprob) && return

    @inbounds shortlist = rule.precalc[downsample_index(index, rule.scale)...]
    ismissing(shortlist) && return

    # Find the expected number of dispersers given population, dispersal prob and timeframe
    meandispersers = round(Int, state * dispersalprob * CellularAutomataBase.timestep(data))
    meandispersers >= zero(meandispersers) || return

    # Convert to an actual number of dispersers for this timestep
    total_dispersers = rand(Poisson(meandispersers)) # randomised
    # total_dispersers = meandispersers # deterministic

    # Get an integer value for the maximum number of dispersers
    # in any single dispersal event
    max_dispersers = trunc(Int, rule.max_dispersers)

    # Simulate (possibly) multiple dispersal events from the cell during the timeframe
    dispersed = 0
    @inbounds while dispersed < total_dispersers
        # Select a subset of dispersers for the dispersal event
        dispersers = min(rand(1:max_dispersers), total_dispersers - dispersed)
        # Choose a cell to disperse to from the precalculated human dispersal distribution
        dest_id = min(length(shortlist), searchsortedfirst(shortlist, rand()))
        # Randomise cell destination within upsampled destination cells
        dest_index = upsample_index(shortlist[dest_id].index, rule.scale) .+
                              (rand(0:rule.scale-1), rand(0:rule.scale-1))
        # Disperse to the cell
        data[dest_index...] += dispersers
        # Track how many have allready dispersed
        dispersed += dispersers
    end
    # Subtract dispersed organisms from current cell population
    @inbounds data[index...] -= dispersed
end
