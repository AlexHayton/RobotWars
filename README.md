		 ___       ___
		 [___] /~\ [___]
		 |ooo|.\_/.|ooo|
		 |888||   ||888|
		 |888||   ||888| 
	  {--|###||___||###|--}
	 {-}  ### /[_]\ ###  {-}
	(O_O) /--[_____]--\ (O_O)
		 (  |       |  )
		[-` ]       [ '-]
		|--|         |--|
		|  |         |  |
	    /  \         /  \
	  /_====_\     /_====_\

Welcome to Robot Wars!

To run the project type 
	`node main` 
in the console. You may need to type 
	`npm install`
first to download all the dependencies.

I have demonstrated the following features in my code:

* Dependency injection and mocking via the 'rewire' plugin for Node.
* A full suite of BDD unit tests implemented via 'jasmine-node'. To execute these type `jasmine-node spec` in a terminal.
* Separation of concerns, keeping the controllers apart from the model and user interface layers. Stubs and Mocking have allowed testing of each layer independently and straight-through tests confirm that the test cases provided are working.
* Additional input safety via the use of a specialised enum library and validations at the model level. Further work could be done here to enforce type safety if I had used TypeScript.
* Detailed code documentation via docco.

If I had more time to spare, it would have been a fun project to write an AngularJS-driven console and visualisation layer served up using the same controller/model via the web browser. I would have liked to have implemented:

* A shared console accessed using a web page and web sockets.
* Further work on user input validation and sanity checking.
* A visualisation of the arena and the robots using HTML5 canvas.
