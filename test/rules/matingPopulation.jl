using Dispersal, Test

@testset "test mating population" begin
    init =  [10.0 10.0 10.0;
             10.0 10.0 10.0;
             10.0 10.0 10.0]

    output = ArrayOutput(init; tspan=1:3)
    rule = Ruleset(MatingPopulation(Moore(1), 1.0, 0.0))
    sim!(output, rule)
    @test output[1] == init
    @test output[2] == init
    @test output[3] == init

    output = ArrayOutput(init; tspan=1:3)
    rule = Ruleset(MatingPopulation(Moore(1), 0.0, 1.0))
    sim!(output, rule)
    @test output[1] == init
    @test output[2] == [30/8 50/8 30/8;
                  50/8 80/8 50/8;
                  30/8 50/8 30/8]
    @test output[3] ==  [180/64  240/64 180/64;
                   240/64  320/64 240/64;
                   180/64  240/64 180/64]

    output = ArrayOutput(init; tspan=1:3)
    rule = Ruleset(MatingDispersal(Moore(1), 0.5, 0.5))
    sim!(output, rule)
    @test output[1] == init
    @test output[2] == 0.5.*init + 0.5.* [30/8 50/8 30/8;
                                          50/8 80/8 50/8;
                                          30/8 50/8 30/8]
    @test output[3] == 0.5.*output[2] + 0.5.*[ 26.25/8  40/8 26.25/8;
                                               40/8  60.0/8 40/8;
                                               26.25/8  40/8 26.25/8]
     
end


using Dispersal
@testset "test mating dispersal population" begin

init =  [0.0 0.0 0.0;
         0.0 1.0 1.0;
         0.0 0.0 0.0]

output = ArrayOutput(init; tspan=1:3)
rule = Ruleset(MatingDispersal(-1,-1))
sim!(output, rule)
output[2]
output[3]
end