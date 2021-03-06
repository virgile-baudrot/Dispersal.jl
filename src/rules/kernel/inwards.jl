
"""
Abstract supertype that extends `NeighborhoodRule` for neighborhood-based
dispersal rules that update a cell based on the values of the surounding cells,
as if dispersing inwards to the current cell.

The result should be identical to the matching [`OutwardsDispersal`](@ref)
methods.
"""
abstract type InwardsDispersal{R,W} <: NeighborhoodRule{R,W} end

"""
    InwardsBinaryDispersal(neighborhood)
    InwardsBinaryDispersal(; neighborhood=DispersalKernel{3}())
    InwardsBinaryDispersal{R,W}(neighborhood)

Binary present/absent dispersal within a [`DispersalKernel`](@ref).
Inwards dispersal calculates dispersal *to* the current cell from cells in the neighborhood.

The current cell is invaded if there is pressure from surrounding cells and
suitable habitat. Otherwise it keeps its current state.

Pass grid name `Symbol`s to `R` and `W` type parameters to use specific grids.

$(FIELDDOCTABLE)
"""
@Probabilistic @Kernel struct InwardsBinaryDispersal{R,W} <: InwardsDispersal{R,W} end


@inline applyrule(data, rule::InwardsBinaryDispersal, state::Integer, index) = begin
    # Combine neighborhood cells into a single scalar
    s = sum(neighborhood(rule))

    # Set to occupied if enough pressure from neighbors
    rand() ^ rule.prob_threshold > (one(s) - s) / one(s) ? oneunit(state) : state
end

"""
    InwardsPopulationDispersal(neighborhood)
    InwardsPopulationDispersal(; neighborhood=DispersalKernel{3}())
    InwardsPopulationDispersal{R,W}(neighborhood)

Disperses to the current cells from the populations of the
surrounding cells, using a dispersal kernel deterministically.

This will only make sense where cell populations are large.

Pass grid name `Symbol`s to `R` and `W` type parameters to use specific grids.

$(FIELDDOCTABLE)
"""
@Kernel struct InwardsPopulationDispersal{R,W} <: InwardsDispersal{R,W} end

@inline applyrule(data, rule::InwardsPopulationDispersal, state::AbstractFloat, index) =
    disperse(neighborhood(rule))


@Layers @Kernel struct SwitchedInwardsPopulationDispersal{R,W,Th} <: InwardsDispersal{R,W}
    threshold::Th
end

@inline applyrule(data, rule::SwitchedInwardsPopulationDispersal, state::AbstractFloat,
                  index) =
    if layer(rule, data, index) > rule.threshold
        disperse(neighborhood(rule))
    else
        state
    end

DynamicGrids.precalcrules(rule::SwitchedInwardsPopulationDispersal, data) =
    precalclayer(layer(rule, data), rule, data)
