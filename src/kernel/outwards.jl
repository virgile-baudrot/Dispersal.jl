"""
    OutwardsPopulationDispersal(neighborhood)
    OutwardsPopulationDispersal(; neighborhood)
    OutwardsPopulationDispersal{R}(; neighborhood)
    OutwardsPopulationDispersal{R,W}(; neighborhood)

Implements deterministic dispersal from the current cell to populations in neighboring 
cells. 

This will make sense ecologically where cell populations are large, 
otherwise a randomised kernel may be more suitable.

The result should be identical to those obtained substituting `OutwardsDispersal` for 
[`InwardsDispersal`](@ref) but may be more efficient when a small number of cells are 
occupied. Conversely, it will become less efficient when a large proportion of the grid 
is occupied.

# Arguments

- `neighborhood`: a [`DispersalKernel`](@ref) based on any DynamicGrids.jl `Neighborhood`.

Pass grid name `Symbol`s to `R` and `W` type parameters to use specific grids.
"""
struct OutwardsDispersal{R,W,N<:AbstractKernel} <: SetNeighborhoodRule{R,W}
    neighborhood::N
end
function OutwardsDispersal{R,W}(; neighborhood=DispersalKernel{3}()) where {R,W} 
    OutwardsDispersal{R,W}(neighborhood)
end

@inline function applyrule!(data, rule::OutwardsDispersal{R,W}, N, I) where {R,W}
    N == zero(N) && return nothing
    sum = zero(N)
    for (i, offset) in enumerate(offsets(rule))
        @inbounds propagules = N * kernel(rule)[i]
        @inbounds add!(data[W], propagules, I .+ offset...)
        sum += propagules
    end
    @inbounds sub!(data[W], sum, I...)
    return nothing
end
