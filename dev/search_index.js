var documenterSearchIndex = {"docs":
[{"location":"#Dispersal.jl-1","page":"Home","title":"Dispersal.jl","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"CurrentModule = Dispersal","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Dispersal","category":"page"},{"location":"#Dispersal.Dispersal","page":"Home","title":"Dispersal.Dispersal","text":"Dispersal\n\n(Image: ) (Image: ) (Image: Build Status) (Image: Build status) (Image: Coverage Status) (Image: codecov.io)\n\nDispersal.jl extends DynamicGrids.jl for grid-based simulations of organism dispersal. Dispersal.jl provides a range of simulation rules than can be combined to develop complex organism dispersal models. \n\nGrowth rates, dispersal kernels, Allee effects, and randomised jump and human assisted dispersal rules are provided. These rules can be chained arbitrarily, and custom rules can easily added and combined with the provided set. See the documentation for examples and the lists of included rules.\n\nDynamicGridsInteract provides an interactive interface for desktop and online web applications, where complete models (including your custom rules) can be manipulated during live simulations. DynamicGridsGtk provides GtkOutput for a simple graphical viewer.\n\nGrowthMaps.jl can efficiently generate the layers required for suitability growth rules based on temperature response and stress factors.\n\n\n\n\n\n","category":"module"},{"location":"#Examples-1","page":"Home","title":"Examples","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"This is the general pattern of running rules in Dispersal.jl.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"We define initial conditions. Then we run a dispersal simulation that combines local and jump dispersal, for three timesteps.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"using Dispersal\n\n# Make an init array the same size as your suitability layer, and seed it\ninit = [0  0  0  0  0  0  0;\n        0  0  0  0  0  0  0;\n        0  0  0  0  0  0  0;\n        0  0  0  0  0  0  0;\n        0  0  1  0  0  0  0;\n        0  0  0  0  0  0  0;\n        0  0  0  0  0  0  0]\n\n# add a 0.0-1.0 scaled raster array that represents habitat suitability\nsuitability = [0.5 0.0 0.3 0.0 0.0 0.3 0.0;\n               0.0 0.2 0.8 0.0 0.9 0.6 0.0;\n               0.0 0.5 1.0 1.0 1.0 0.0 0.0;\n               0.0 0.0 1.0 1.0 0.7 0.0 0.0;\n               0.0 0.0 0.6 1.0 0.0 0.0 0.0;\n               0.0 0.1 0.6 0.0 0.0 0.0 0.0;\n               0.0 0.0 0.0 0.0 0.0 0.0 0.7]\n\n\n# Define the neighborhood, using the dispersal kernel and a radius\nλ = 1.0\nradius = 1\nhood = DispersalKernel{radius}(;kernel=zeros(radius, radius), formulation=ExponentialKernel(λ))\n\n# Define disersal rules\nlocaldisp = InwardsBinaryDispersal(neighborhood=hood)\n\n# Set the output type\noutput = ArrayOutput(init, 3)\n\n# Run the simulation\nsim!(output, Ruleset(localdisp); init=init, tspan=(1, 3))\n\noutput[3]","category":"page"},{"location":"#Neighborhood-Rules-1","page":"Home","title":"Neighborhood Rules","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"Rules that consider the neighborhood of cells surrounding the current cell. These disperse inwards to the current cell from the surrounding cell.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"AbstractInwardsDispersal\nInwardsBinaryDispersal\nInwardsPopulationDispersal\nPoissonInwardsPopulationDispersal","category":"page"},{"location":"#Dispersal.InwardsBinaryDispersal","page":"Home","title":"Dispersal.InwardsBinaryDispersal","text":"Binary present/absent dispersal within a DispersalKernel.  Inwards dispersal calculates dispersal to the current cell from cells in the neighborhood.\n\nThe current cell is invaded if there is pressure from surrounding cells and suitable habitat. Otherwise it keeps its current state.\n\nField Description Default Limits\nneighborhood Normalised proportions of dispersal to surrounding cells DispersalKernel{3,ExponentialKernel{Floa (1.0e-7, 1.0)\nprob_threshold A real number between one and zero 0.1 (0.0, 1.0)\n\n\n\n\n\n","category":"type"},{"location":"#Dispersal.InwardsPopulationDispersal","page":"Home","title":"Dispersal.InwardsPopulationDispersal","text":"Disperses to the current cells from the populations of the surrounding cells, using a dispersal kernel.\n\nField Description Default Limits\nneighborhood Normalised proportions of dispersal to surrounding cells DispersalKernel{3,ExponentialKernel{Floa (1.0e-7, 1.0)\n\n\n\n\n\n","category":"type"},{"location":"#Dispersal.PoissonInwardsPopulationDispersal","page":"Home","title":"Dispersal.PoissonInwardsPopulationDispersal","text":"Disperses to the current cells from the populations of the surrounding cells, using a dispersal kernel. Dispersal amounts are randomised with a Poisonn distribution.\n\nField Description Default Limits\nneighborhood Normalised proportions of dispersal to surrounding cells DispersalKernel{3,ExponentialKernel{Floa (1.0e-7, 1.0)\n\n\n\n\n\n","category":"type"},{"location":"#Partial-Neighborhood-Rules-1","page":"Home","title":"Partial Neighborhood Rules","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"Partial neighborhood rules that disperse outwards to the neighborhood  when local populations exist.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"AbstractOutwardsDispersal\nOutwardsBinaryDispersal\nOutwardsPopulationDispersal","category":"page"},{"location":"#Dispersal.OutwardsBinaryDispersal","page":"Home","title":"Dispersal.OutwardsBinaryDispersal","text":"Cells in the surrounding DispersalNeighborhood have some propability of  invasion if the current cell is occupied.\n\nField Description Default Limits\nneighborhood Normalised proportions of dispersal to surrounding cells DispersalKernel{3,ExponentialKernel{Floa (1.0e-7, 1.0)\nprob_threshold A real number between one and zero 0.1 (0.0, 1.0)\n\n\n\n\n\n","category":"type"},{"location":"#Dispersal.OutwardsPopulationDispersal","page":"Home","title":"Dispersal.OutwardsPopulationDispersal","text":"Dispersal reduces the current cell population, increasing the populations of the  cells in the surrounding DispersalNeighborhood.\n\nField Description Default Limits\nneighborhood Normalised proportions of dispersal to surrounding cells DispersalKernel{3,ExponentialKernel{Floa (1.0e-7, 1.0)\n\n\n\n\n\n","category":"type"},{"location":"#Dispersal-kernels-1","page":"Home","title":"Dispersal kernels","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"Kernels extend DynamicGrids.AbstractNeighborhood and neighbors() methods.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"AbstractDispersalKernel\nDispersalKernel","category":"page"},{"location":"#Dispersal.DispersalKernel","page":"Home","title":"Dispersal.DispersalKernel","text":"A neighborhood built from a dispersal kernel function and a cell radius. Can be built directly by passing in the array, radius and overflow arguments, but preferably use the keyword constructor to build the array from a dispersal kernel function.\n\nField Description Default Limits\nformulation Kernel formulation object ExponentialKernel{Float64}(1.0) (1.0e-7, 1.0)\nkernel Kernal matrix nothing (1.0e-7, 1.0)\ncellsize Simulation cell size 1.0 (0.0, 10.0)\ndistancemethod Method for calculating distance between cells CentroidToCentroid() (1.0e-7, 1.0)\n\n\n\n\n\n","category":"type"},{"location":"#Cell-rules-1","page":"Home","title":"Cell rules","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"Rules that simply transform the state of a single cell, ignoring the rest of the grid.","category":"page"},{"location":"#Growth-rules-1","page":"Home","title":"Growth rules","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"AbstractGrowthRule\nEulerExponentialGrowth\nEulerLogisticGrowth\nSuitabilityEulerExponentialGrowth\nSuitabilityEulerLogisticGrowth\nExactExponentialGrowth\nExactLogisticGrowth\nSuitabilityExactExponentialGrowth\nSuitabilityExactLogisticGrowth\nSuitabilityMask","category":"page"},{"location":"#Dispersal.ExactExponentialGrowth","page":"Home","title":"Dispersal.ExactExponentialGrowth","text":"Simple fixed exponential growth rate using exact solution.\n\nField Description Default Limits\ntimestep Timestep converted from sim data. Needs to be separate from rate for DateTime nothing (1.0e-7, 1.0)\nnsteps The exact nsteps timestep, updated by precalcrule 1.0 (1.0e-7, 1.0)\nintrinsicrate Intrinsic rate of growth per timestep 0.1 (0.0, 10.0)\n\n\n\n\n\n","category":"type"},{"location":"#Dispersal.ExactLogisticGrowth","page":"Home","title":"Dispersal.ExactLogisticGrowth","text":"Simple fixed logistic growth rate using exact solution\n\nField Description Default Limits\ntimestep Timestep converted from sim data. Needs to be separate from rate for DateTime nothing (1.0e-7, 1.0)\nnsteps The exact nsteps timestep, updated by precalcrule 1.0 (1.0e-7, 1.0)\nintrinsicrate Intrinsic rate of growth per timestep 0.1 (0.0, 10.0)\ncarrycap Carrying capacity for each cell. Not currently scaled by area. 100000.0 (0.0, 1.0e9)\n\n\n\n\n\n","category":"type"},{"location":"#Mask-layers-1","page":"Home","title":"Mask layers","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"Mask","category":"page"},{"location":"#Allee-effects-1","page":"Home","title":"Allee effects","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"AbstractAlleeExtinction\nAlleeExtinction","category":"page"},{"location":"#Dispersal.AlleeExtinction","page":"Home","title":"Dispersal.AlleeExtinction","text":"Enforces extinction in a cell with a population below the minimum number of  individuals required to maintain a population. \n\nField Description Default Limits\nminfounders Minimum founding individuals required to to start an ongoing population 5.0 (1.0, 200.0)\n\n\n\n\n\n","category":"type"},{"location":"#Partial-Rules-1","page":"Home","title":"Partial Rules","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"These rules only partially update the grid. They often operate only on cells that are currently occupied.","category":"page"},{"location":"#Jump-dispersal-1","page":"Home","title":"Jump dispersal","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"AbstractJumpDispersal\nJumpDispersal","category":"page"},{"location":"#Dispersal.AbstractJumpDispersal","page":"Home","title":"Dispersal.AbstractJumpDispersal","text":"abstract type AbstractJumpDispersal <: PartialRule\n\nExtends PartialRule for jump dispersal rules\n\n\n\n\n\n","category":"type"},{"location":"#Dispersal.JumpDispersal","page":"Home","title":"Dispersal.JumpDispersal","text":"Jump dispersal simulates random long distance dispersal events. A random cell within  the spotrange is invaded.  A Mask rule may be useful  aftwer this rule, as dispersal events may be to anywhere on the grid within the given range.\n\nField Description Default Limits\nspotrange A number or Unitful.jl distance with the same units as cellsize 30.0 (0.0, 100.0)\nprob_threshold A real number between one and zero 0.1 (0.0, 1.0)\n\n\n\n\n\n","category":"type"},{"location":"#Human-driven-dispersal-1","page":"Home","title":"Human driven dispersal","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"AbstractHumanDispersal\nHumanDispersal","category":"page"},{"location":"#Dispersal.HumanDispersal","page":"Home","title":"Dispersal.HumanDispersal","text":"HumanDispersal Rules human-driven dispersal patterns using population data.\n\nTransport connections between grid cells are calculated using distance and human population, modified with the human_exponent and dist_exponent parameters. A shortlist of the most connected cells is selected for use in the simulation.\n\nThe time taken for precalulation will depend on the scale argument. Values above 1 will downsample the grid to improve precalulation time and runtime performance. A high scale value is good for use in a live interface.\n\nArguments\n\nField Description Default Limits\nhuman_pop  nothing (1.0e-7, 1.0)\ncellsize  nothing (1.0e-7, 1.0)\nscale  nothing (1.0e-7, 1.0)\naggregator A function that aggregates scaled down cells nothing (1.0e-7, 1.0)\nhuman_exponent Human population exponent nothing (1.0, 3.0)\ndist_exponent Distance exponent nothing (1.0, 3.0)\ndispersalperpop Scales the number of dispersing individuals by human activity (ie population^human_exponent) nothing (0.0, 1.0e-8)\nmax_dispersers Maximum number of dispersers in a dispersal events nothing (50.0, 10000.0)\nshortlist_len Length of dest shortlist nothing (1.0e-7, 1.0)\ntimestep  nothing (1.0e-7, 1.0)\ndest_shortlists  nothing (1.0e-7, 1.0)\nproportion_covered  nothing (1.0e-7, 1.0)\ndispersal_probs  nothing (1.0e-7, 1.0)\nhuman_buffer  nothing (1.0e-7, 1.0)\ndist_buffer  nothing (1.0e-7, 1.0)\n\n\n\n\n\n","category":"type"},{"location":"#Layers-1","page":"Home","title":"Layers","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"Layers provide overlay grids of raster data to rules. They can be simple matrices, or sequences for time series data.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Like rules, than can be combined arbitrarily, in this case in a tuple. Methods loop through all layers to return a scalar that is the product of their outputs.","category":"page"},{"location":"#Types-1","page":"Home","title":"Types","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"AbstractSequence\nSequence","category":"page"},{"location":"#Methods-1","page":"Home","title":"Methods","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"sequence_interpolate\ncyclic","category":"page"},{"location":"#Dispersal.cyclic","page":"Home","title":"Dispersal.cyclic","text":"Cycles a time position through a particular timestep length\n\n\n\n\n\n","category":"function"},{"location":"#Optimisation-1","page":"Home","title":"Optimisation","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"Dispersal.jl provides optimisation tools for automatically optimising  the parameters of arbitrary rulesets given target data. AbstractObjective  can be extended to add specific objection functions to transform simulation outputs.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Parametriser\n(p::Parametriser)(params)\nAbstractObjective\nSimpleObjective\nRegionObjective\nsimpredictions\ntargets","category":"page"},{"location":"#Dispersal.Parametriser","page":"Home","title":"Dispersal.Parametriser","text":"struct Parametriser{RU, OP, OB, TR, L, NR, GS, TSta, TSto, TH, D, TB, PB, RE}\n\nParametrizer object to use with Optim.jl or similar\n\nArguments\n\nruleset::Ruleset: simulation ruleset, with init array attached objective::Objective: objective data transform: single argument function to transform targets and predictions before the loss function loss: LossFunctions.jl loss function ngroups: number of replicate simulation groupsize: number of simulations in a group. Larger groups may inprove distributed performance. tstop: length of simulation output: optional output type. By default an ArrayOutput will be generated.\n\n\n\n\n\n","category":"type"},{"location":"#Dispersal.SimpleObjective","page":"Home","title":"Dispersal.SimpleObjective","text":"struct SimpleObjective{T} <: Dispersal.Objective\n\nA basic objective that holds a target array uses the final frame of the simulation as the prediction.\n\n\n\n\n\n","category":"type"},{"location":"#Dispersal.RegionObjective","page":"Home","title":"Dispersal.RegionObjective","text":"struct RegionObjective{DT, RL, OC, FS, S} <: Dispersal.Objective\n\nImplementation of a loss objective that converts cell data to regional presence/absence and compares to a target of regional occurance data.\n\n\n\n\n\n","category":"type"},{"location":"#Dispersal.targets","page":"Home","title":"Dispersal.targets","text":"targets(obj::Objective)\n\nReturns a targets array given an Objective. The targets must match the size and dimensions of the prediction array returned by simpredictions.\n\n\n\n\n\n","category":"function"},{"location":"example/#Dispersal-simulations-1","page":"Examples","title":"Dispersal simulations","text":"","category":"section"},{"location":"example/#","page":"Examples","title":"Examples","text":"In this example we will run a simulation of the spread of the Spotted Winged Drosophila D. suzukii accross the continental USA.","category":"page"},{"location":"example/#Setup-1","page":"Examples","title":"Setup","text":"","category":"section"},{"location":"example/#","page":"Examples","title":"Examples","text":"First, load the required packages. Dates is a core julia package that give us date/time handling, GeoData simplifies the loading of geospatial  raster files.","category":"page"},{"location":"example/#","page":"Examples","title":"Examples","text":"using Dispersal, Dates, GeoData, Plots\nusing GeoData: Time","category":"page"},{"location":"example/#Define-simulation-settings-1","page":"Examples","title":"Define simulation settings","text":"","category":"section"},{"location":"example/#","page":"Examples","title":"Examples","text":"cellsize = 1.0\n# Using DateTime units for the timestep.\nsimtimestep = Month(1);","category":"page"},{"location":"example/#Define-a-RuleSet-1","page":"Examples","title":"Define a RuleSet","text":"","category":"section"},{"location":"example/#","page":"Examples","title":"Examples","text":"This will involve combining multiple dispersal componenents into a single RuleSet object: population growth, local dispersal, Allee effects, and human dispersal.","category":"page"},{"location":"example/#Climate-driven-population-growth-1","page":"Examples","title":"Climate driven population growth","text":"","category":"section"},{"location":"example/#Build-a-growth-rate-matrix-1","page":"Examples","title":"Build a growth-rate matrix","text":"","category":"section"},{"location":"example/#","page":"Examples","title":"Examples","text":"Follow the examples tutorial over at GrowthRates.jl. To skip this step just download the output saved in the example:","category":"page"},{"location":"example/#","page":"Examples","title":"Examples","text":"using JLD2\ndataurl = \"https://media.githubusercontent.com/media/cesaraustralia/Dispersal.jl/data\"\ngrowthratesfilename = \"growthrates.jld2\"\nif !isfile(growthratesfilename)\n    download(joinpath(dataurl, growthratesfilename))\nend\n@load \"growthrates.jld2\" growthrates","category":"page"},{"location":"example/#","page":"Examples","title":"Examples","text":"Plot the growth layer:","category":"page"},{"location":"example/#","page":"Examples","title":"Examples","text":"using Plots\nplot(growthrates[Time(1)])\nsavefig(\"build/assets/growthrates.png\")","category":"page"},{"location":"example/#","page":"Examples","title":"Examples","text":"Create a ExactLogisticGrowthMap rule from the layer, here we use unitful units for the layers' Time dimension:","category":"page"},{"location":"example/#","page":"Examples","title":"Examples","text":"carrycap = 1e8\ngrowth = ExactLogisticGrowthMap(layer=growthrates, carrycap=carrycap);","category":"page"},{"location":"example/#Local-dispersal-1","page":"Examples","title":"Local dispersal","text":"","category":"section"},{"location":"example/#","page":"Examples","title":"Examples","text":"lambda = 0.0125\nradius = 1\nsze = 2radius + 1\ndm = AreaToArea(30)\n@time hood = DispersalKernel{radius}(;kernel=zeros(Float64, radius, radius), cellsize=cellsize,\n                               formulation=ExponentialKernel(lambda), distancemethod=dm)\nlocaldisp = InwardsPopulationDispersal(hood)\ndisplay(hood.kernel * carrycap);","category":"page"},{"location":"example/#Allee-effects-1","page":"Examples","title":"Allee effects","text":"","category":"section"},{"location":"example/#","page":"Examples","title":"Examples","text":"allee = AlleeExtinction(minfounders=10.0);","category":"page"},{"location":"example/#Human-dispersal-1","page":"Examples","title":"Human dispersal","text":"","category":"section"},{"location":"example/#","page":"Examples","title":"Examples","text":"The human dispersal component is generated from an array or population data. First we'll open an input tiff, and move it to a memory backed GeoArray. ","category":"page"},{"location":"example/#","page":"Examples","title":"Examples","text":"humanpopfilename = \"population_density.tif\"\nif !isfile(humanpopfilename)\n    download(joinpath(dataurl, humanpopfilename))\nend\nhuman_pop = GDALarray(humanpopfilename)[Band(1), Lon(590:1125), Lat(150:480)]\nsize(growthrates)\ndims(human_pop)\nwindow = Lat(Between(bounds(growthrates, Lat))), Lon(Between(bounds(growthrates, Lon))) \nplot(human_pop[window...])\nplot(growthrates[window...][Time(1)])\n\nsavefig(\"build/assets/human_pop.png\")","category":"page"},{"location":"example/#","page":"Examples","title":"Examples","text":"(Image: popgrowth)","category":"page"},{"location":"example/#","page":"Examples","title":"Examples","text":"scale = 8\nhuman_exponent = 2.0\ndist_exponent = 2.0\ndispersalperpop = 1e-9\nmax_dispersers = 500.0\nshortlist_len = 100\n@time humandisp = HumanDispersal(parent(human_pop); scale=scale, shortlist_len=shortlist_len, dispersalperpop=dispersalperpop,\n                                 max_dispersers=max_dispersers, cellsize=cellsize, human_exponent=human_exponent,\n                                 dist_exponent=dist_exponent, timestep=simtimestep);","category":"page"},{"location":"example/#Define-initialisation-data-1","page":"Examples","title":"Define initialisation data","text":"","category":"section"},{"location":"example/#","page":"Examples","title":"Examples","text":"Make a zeros array and populate the starting cells:","category":"page"},{"location":"example/#","page":"Examples","title":"Examples","text":"init = zero(growthrates[Time(1), Band(1)])\n\nincursion = [(36.9677,-122.0294),\n             (37.3226,-121.8921),\n             (37.6008,-120.9545),\n             (35.3453,-119.0586),\n             (38.7318,-121.9014),\n             (38.5249,-121.9708),\n             (37.2502,-119.751)]\n\n# Using `Near` finds the nearest cell to the coordinates\nfor (lat, lon) in incursion \n    init[Lat(Near(lat)), Lon(Near(lon))] = 1e7 \nend","category":"page"},{"location":"example/#Define-a-masking-layer-1","page":"Examples","title":"Define a masking layer","text":"","category":"section"},{"location":"example/#","page":"Examples","title":"Examples","text":"This layer lets the simulation know which cells should be ignored.","category":"page"},{"location":"example/#","page":"Examples","title":"Examples","text":"masklayer = BitArray(mask(growthrates[Time(1), Band(1)]))\nheatmap(masklayer)\nsavefig(\"build/assets/mask.png\")","category":"page"},{"location":"example/#","page":"Examples","title":"Examples","text":"(Image: mask)","category":"page"},{"location":"example/#Define-a-combined-ruleset-1","page":"Examples","title":"Define a combined ruleset","text":"","category":"section"},{"location":"example/#","page":"Examples","title":"Examples","text":"ruleset = Ruleset(humandisp, Chain(localdisp, allee, growth); \n                  init=init, \n                  mask=masklayer, \n                  timestep=simtimestep, \n                  minval=0.0, \n                  maxval=carrycap);","category":"page"},{"location":"example/#Output-1","page":"Examples","title":"Output","text":"","category":"section"},{"location":"example/#","page":"Examples","title":"Examples","text":"The simplest and most performant output for a simulation is an ArrayOutput, which simply writes the simulation to a preallocated array without visualising it.  ","category":"page"},{"location":"example/#","page":"Examples","title":"Examples","text":"tstop = 100\noutput = ArrayOutput(init, tstop) ","category":"page"},{"location":"example/#Run-a-simulation-1","page":"Examples","title":"Run a simulation","text":"","category":"section"},{"location":"example/#","page":"Examples","title":"Examples","text":"To run a simulation, we pass in the output and rulset.","category":"page"},{"location":"example/#","page":"Examples","title":"Examples","text":"# FIXME: this hangs\n# sim!(output, ruleset)","category":"page"},{"location":"example/#Save-a-gif-of-your-simulation-1","page":"Examples","title":"Save a gif of your simulation","text":"","category":"section"},{"location":"example/#","page":"Examples","title":"Examples","text":"Gif files are an easy way to share the visual dynamics of the simulation. First we need to define a color processor to turn the simulation into images for the frames of the the gif. This processor can also be used later in web or gtk outputs.","category":"page"},{"location":"example/#","page":"Examples","title":"Examples","text":"You can use the built-in Greyscale scheme, or any scheme from ColorSchemes.jl.","category":"page"},{"location":"example/#","page":"Examples","title":"Examples","text":"using ColorSchemes\n#scheme = ColorSchemes.autumn1\nscheme = ColorSchemes.Oranges_3\n\n## Frame Processing Colors\nzerocolor = RGB24(0.7) \nmaskcolor = RGB24(0.0)\nprocessor = ColorProcessor(scheme, zerocolor, maskcolor);","category":"page"},{"location":"example/#","page":"Examples","title":"Examples","text":"With a non-image output like ArrayOuput we need to pass in the image processor manually.","category":"page"},{"location":"example/#","page":"Examples","title":"Examples","text":"savegif(\"build/assets/sim.gif\", output, ruleset, processor; fps=10)","category":"page"},{"location":"example/#","page":"Examples","title":"Examples","text":"(Image: Drosphila suzukii spread)","category":"page"},{"location":"example/#Live-simulation-outputs-1","page":"Examples","title":"Live simulation outputs","text":"","category":"section"},{"location":"example/#","page":"Examples","title":"Examples","text":"There are a number of live outputs provided in CelularAutomataBase.jl and specific output packages DynamicGridsGtk and DynamicGridsInteract that keep heavy graphics and web dependencies separate form the rest of the framework.","category":"page"},{"location":"example/#REPL-output-1","page":"Examples","title":"REPL output","text":"","category":"section"},{"location":"example/#","page":"Examples","title":"Examples","text":"You can view a simulation over SSH or just in your local console using the included REPLOutput. It doesn't work so well in Juno, so we only recommend using it in a real terminal. It also works better in a terminal where you can easily reduce the font size.","category":"page"},{"location":"example/#","page":"Examples","title":"Examples","text":"using Crayons\noutput = REPLOutput(init; style=Block(), fps=5, color=:white, store=false)","category":"page"},{"location":"example/#","page":"Examples","title":"Examples","text":"The Braile() style is half the dimensions of the Block() style, but doen't look as clear.","category":"page"},{"location":"example/#","page":"Examples","title":"Examples","text":"output = REPLOutput(init; style=Braile(), fps=5, color=:white, store=false)","category":"page"},{"location":"example/#Interactive-web-outputs-1","page":"Examples","title":"Interactive web outputs","text":"","category":"section"},{"location":"example/#","page":"Examples","title":"Examples","text":"DynamicGridsInteract.jl produces interactive web page outputs for a simulation. It uses Interact.jl for live control, providing a control console and sliders for model parameters, even for your own custom models.","category":"page"},{"location":"example/#","page":"Examples","title":"Examples","text":"The simple InteractOutput() is the core output that can run on its own inside Juno or a Jupyter notebook. It can also be served to a browser locally or over the web using ServerOutput(), or run in a standalone desktop app using ElectronOutput().","category":"page"},{"location":"example/#Juno-or-jupyter-notebooks-1","page":"Examples","title":"Juno or jupyter notebooks","text":"","category":"section"},{"location":"example/#","page":"Examples","title":"Examples","text":"Building a InteractOutput() and running display() will open an output in a plot pane in Juno. See the example above to define an image processor. Setting store to true will save the last simulation to the output array to be saved or converted to a gif. Really long simulations may use your avilable ram, in which case set store to false.","category":"page"},{"location":"example/#","page":"Examples","title":"Examples","text":"using DynamicGridsInteract\noutput = InteractOutput(init, ruleset; fps=10, store=true, processor=processor, slider_throttle=1.0)\ndisplay(output)","category":"page"},{"location":"example/#Wrap-the-IneractOutput-in-a-standalone-desktop-(electron)-app-1","page":"Examples","title":"Wrap the IneractOutput in a standalone desktop (electron) app","text":"","category":"section"},{"location":"example/#","page":"Examples","title":"Examples","text":"This will create a standalone desktop app wrapping the InteractOutput. Unfortunately the compile and load time for electron can take quite a while.","category":"page"},{"location":"example/#","page":"Examples","title":"Examples","text":"output = ElectronOutput(init, ruleset; fps=10, store=true, processor=processor, slider_throttle=1.0)","category":"page"},{"location":"example/#Serving-web-pages-1","page":"Examples","title":"Serving web pages","text":"","category":"section"},{"location":"example/#","page":"Examples","title":"Examples","text":"The InteractOutput can be served locally or over the web. You may need to do some port or firewall configuration on your server, but otherwise this is all you need to do to serve a simulation. Unlike other outputs, ServerOutput makes a copy of the internal InteractOutput for each new connection. Changes in one connection will not effect anything in the others.","category":"page"},{"location":"example/#","page":"Examples","title":"Examples","text":"output = ServerOutput(init, model; port=8000, fps=10, processor=processor, slider_throttle=1.0)","category":"page"},{"location":"example/#Run-in-a-GTK-window-1","page":"Examples","title":"Run in a GTK window","text":"","category":"section"},{"location":"example/#","page":"Examples","title":"Examples","text":"The GTKOutput in DynamicGridsGtk.jl is a simple desktop output that just shows the simulation without controls. It can be useful for faster load-time than ElectronOutput, and also dedicates all screenspace to viewing the simulation.","category":"page"},{"location":"example/#","page":"Examples","title":"Examples","text":"using DynamicGridsGtk\noutput = GtkOutput(init .* 0; fps=10, store=true, processor=processor)","category":"page"},{"location":"example/#Adding-your-own-rules-1","page":"Examples","title":"Adding your own rules","text":"","category":"section"},{"location":"example/#","page":"Examples","title":"Examples","text":"In Dispersal.jl and the CelularAutomataBase.jl framework it's easy to add your won custom model components, or 'rules' to follow the language of cellular automata. If you write them well they will perform as well as the built in rules, and can take advantage of a number of the same performance optimisations by using the type heirarchy in DynamicGrids.jl. ","category":"page"},{"location":"example/#","page":"Examples","title":"Examples","text":"Rules may be a [number of types]. ","category":"page"}]
}
