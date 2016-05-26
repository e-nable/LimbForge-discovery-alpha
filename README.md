#LimbForge
Welcome to LimbForge!  LimbForge is a tool for precisely sizing upper limb assistive devices for 3D printing.  If you are interested in helping to develop LimbForge, please visit the [issues page](https://github.com/e-nable/LimbForge/issues) to see what is under active and future development. If youa are a designer interested in on-boarding a new design, [please visit the wiki](https://github.com/e-nable/LimbForge/wiki) for more detailed information about the requirements and on-boarding process.

## How LimbForge Works
LimbForge leverages look-up tables populated with pre-sized versions of every part needed to assemble a device.  Historically, "sizing" has meant linear scaling in the lexicon of e-NABLE devices, but LimbForge allows for a more intentional sizing strategy that has many benefits, including, but not limited to:
* Persistent mechanical clearances across all sizes of device
* Persistent hole sizes for screws or other non-printed hardware
* Persistent interfaces to allow for greater simplicity and fewer part variations

![](https://github.com/e-nable/LimbForge/blob/gh-pages/img/documentation/fusion_params.png)

Look-up tables for a design can be created manually or with [Hans Kellner's ParaParam script for Fusion 360](https://github.com/hanskellner/Fusion360ParaParam).  Using a script like ParaParam in a parametric CAD tool allows for the greatest agility in populating and updating the look-up tables as changes to the master geometry can be rapidly propagated to all other sizes.  

## Strengths of the Approach
The look-up table strategy is tool-agnostic, though some tools (parametric CAD) will be easier than others, though there are likely scriptable mesh-based solutions that would work well.  In addition to being an open platform for device distribution, the simplicity of the look-up table makes the on-boarding process very accessible.  This approach also supports hybrid designs, in which some parts remain linearly-scaled meshes and other parts are parametrically-driven to eliminate the inconsistent clearances evolved from this linear scaling.  

Perhaps most importantly, the size-invariant holes and other features and interfaces allow for dramatic simplification in the fasteners and other materials necessary to assemble a device.  This also opens up device architecture to much more effectively leverage off-the-shelf components and hardware that could not have been effective across all sizes previously.  

## Limitations of the Approach
As designs become more and more configurable, the number of files necessary to fully define the design grows. Maintaining consistent interfaces between parts will be critical to the adaptability of the tool to more complex designs.

## The Importance of Instrumentation and Feedback
LimbForge is instrumented with Google Analytics to collect data about what hand designs and at what sizes are created.  Nobody knows how many e-NABLE devices have been produced, at what sizes, or which designs.  By measuring what sizes are downloaded most often and which designs are more popular, we can better inform the efforts of e-NABLE designers to better align with the observed (and quantified) need.  Longer term, we intend to integrate better tools for feedback into LimbForge to capture both fabricator and recipient comments and critiques of the designs.

## Looking Forward
There's still a lot to do to fully realize the potential of the system that LimbForge enables, but the goal is build an instrumented tool that in addition to empowering its users, provides the data necessary to guide its developers and designers so that both are making an impact.