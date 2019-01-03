using Distributed, Revise
@everywhere using Cellular,
      Dispersal,
      Test
setup(x) = x

# For manual testing on CUDA
# using CuArrays, CUDAnative
# setup(x) = CuArray(x)

@testset "layers" begin include("layers.jl") end
@testset "growth" begin include("growth.jl") end
@testset "human" begin include("human.jl") end
@testset "inwards" begin include("inwards.jl") end
@testset "outwards" begin include("outwards.jl") end
@testset "integration" begin include("integration.jl") end
@testset "allee" begin include("allee.jl") end
