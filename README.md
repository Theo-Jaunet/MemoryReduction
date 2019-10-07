# What if we Reduce the Memory of an Artificial Doom Player?
Online exploration of memory reduction strategies of a DRL agent trained to solve a navigation task on ViZDoom.

Authors: Théo Jaunet, Romain Vuillemot and Christian Wolf.

<img src="https://github.com/Theo-Jaunet/MemoryReduction/blob/master/assets/screenshot.png" />




## Live Demo

This tool is accessible using the following link: [https://theo-jaunet.github.io/MemoryReduction/](https://theo-jaunet.github.io/MemoryReduction/). (designed to work on desktop with google chrome)



## Running it Locally 

To run this interface locally, download or clone this repository

```
git clone https://github.com/Theo-Jaunet/MemoryReduction.git
``` 


Open the downloaded directory and start any server. For demonstration sake we used: [SimpleHTTPServer](https://docs.python.org/2/library/simplehttpserver.html)

```
python -m SimpleHTTPServer 8000
```

Once the server is launched, you should be able to access the explorable at: http://localhost:8000/.



## The DRL Model Used & Scenario 

For more information on this task and model, please check [Edward Beeching's github repo.](https://github.com/edbeeching/3d_control_deep_rl)




