// Authored computing and design technology explanations, one per catalogue topic.
//
// Computing is pitched at GCSE demand: algorithm efficiency is compared
// informally, as the specifications require, with no asymptotic complexity
// analysis. Pseudocode follows the plain style used across the boards.
export const technicalContent = {
  // ---- Computing, Year 7 -------------------------------------------------
  "y7-computing-algorithms-and-decomposition": {
    explanation:
      "An algorithm is a sequence of steps that solves a problem, and it must be precise enough that following it blindly produces the right result. Decomposition breaks a large problem into smaller sub-problems that can each be solved and then combined, which is how any substantial program is written. Abstraction removes detail that does not matter for the problem, so a map of the underground shows connections rather than real distances. Tracing an algorithm means working through it by hand with a table of variable values, which is the quickest way to find a logic error.",
    keyIdeas: [
      "An algorithm must be precise enough to follow without judgement.",
      "Decomposition breaks a problem into solvable parts.",
      "Abstraction removes the detail that does not matter.",
      "Trace with a table of variable values to find logic errors.",
    ],
    formulae: [],
  },
  "y7-computing-programming-foundations": {
    explanation:
      "A variable is a named place in memory whose value can change, and giving it a meaningful name makes a program readable. Input takes data from the user, and it usually arrives as text, so it must be converted before arithmetic. Selection uses IF, ELSE IF and ELSE to choose between paths based on a condition, and a condition evaluates to true or false. A count-controlled loop repeats a fixed number of times using FOR, which is the right choice when you know in advance how many repetitions are needed.",
    keyIdeas: [
      "Name variables for what they hold, not x and y.",
      "Input arrives as text and must be converted for arithmetic.",
      "Selection chooses a path; a condition is true or false.",
      "FOR loops repeat a known number of times.",
    ],
    formulae: ["FOR i = 1 TO 10 ... NEXT i", "IF condition THEN ... ELSE ... ENDIF"],
  },
  "y7-computing-binary-and-data-representation": {
    explanation:
      "Computers store everything as binary, using only 0 and 1, because a circuit is either on or off. Each binary digit is a bit, eight bits make a byte, and the place values in an 8-bit number are 128, 64, 32, 16, 8, 4, 2 and 1, so converting to denary means adding the place values where there is a 1. Text is stored by giving each character a number, as in ASCII, where capital A is 65. An image is a grid of pixels, each storing a colour value, so the file size depends on the number of pixels and the number of bits used per pixel.",
    keyIdeas: [
      "8 bits make a byte; place values are 128 down to 1.",
      "Characters are stored as numbers, as in ASCII.",
      "An image is a grid of pixels, each with a colour value.",
      "More pixels or more bits per pixel means a larger file.",
    ],
    formulae: ["Image file size (bits) $=$ width $\\times$ height $\\times$ colour depth"],
  },
  "y7-computing-networks-and-digital-safety": {
    explanation:
      "A network connects devices so they can share data and resources, using hardware such as a router to join networks, a switch to direct traffic within one, and a network interface card in each device. Data is split into packets, each carrying the destination address and a sequence number, which travel independently and are reassembled at the far end. Personal data should be shared deliberately rather than by default, and the practical protections are strong unique passwords, two-factor authentication, privacy settings and caution about what is permanent once posted. Anything published online should be assumed to be copyable and lasting.",
    keyIdeas: [
      "A router joins networks; a switch directs traffic within one.",
      "Data travels as packets and is reassembled at the destination.",
      "Strong unique passwords and two-factor authentication do most of the work.",
      "Assume anything posted online is permanent and copyable.",
    ],
    formulae: [],
  },

  // ---- Computing, Year 8 -------------------------------------------------
  "y8-computing-modular-programs": {
    explanation:
      "A procedure or function is a named block of code that can be called from anywhere, which avoids repetition and makes a program easier to test and change. A function returns a value; a procedure performs an action without returning one. Parameters pass data into a subprogram, and a variable declared inside it is local, which prevents accidental interference with the rest of the program. Lists store many values under one name with an index, and systematic debugging means testing each subprogram on its own before testing them together.",
    keyIdeas: [
      "A function returns a value; a procedure does not.",
      "Parameters pass data in; local variables stay inside.",
      "A list holds many values under one name, accessed by index.",
      "Test each subprogram alone before testing the whole.",
    ],
    formulae: ["FUNCTION name(parameter) ... RETURN value ... ENDFUNCTION"],
  },
  "y8-computing-hardware-and-software": {
    explanation:
      "The CPU repeatedly fetches an instruction from memory, decodes it to work out what is required, and executes it, which is the fetch-execute cycle. RAM is volatile main memory holding programs and data in use, while secondary storage keeps data when the power is off, using magnetic hard disks, solid state drives with no moving parts, or optical discs. System software - the operating system and utilities - manages the hardware and provides services, while application software does the user's work. Choosing storage means weighing capacity, speed, durability, portability and cost.",
    keyIdeas: [
      "Fetch, decode, execute, repeated billions of times per second.",
      "RAM is volatile; secondary storage is not.",
      "Solid state is faster and more durable; magnetic is cheaper per gigabyte.",
      "System software manages the machine; applications do the user's work.",
    ],
    formulae: [],
  },
  "y8-computing-databases-and-data-modelling": {
    explanation:
      "A database stores structured data in tables of records, where each record describes one thing and each field holds one attribute of it. A field has a data type - text, integer, real, Boolean, date - chosen so that storage is efficient and invalid values are rejected. A primary key is a field whose value is unique for every record, which is what makes a record findable and lets tables be linked. Queries select the records that match criteria, and validation rules such as range, format, presence and length checks keep the data usable.",
    keyIdeas: [
      "A record is one thing; a field is one attribute of it.",
      "The data type constrains what can be stored.",
      "A primary key is unique for every record.",
      "Validation checks the form of data, not its truth.",
    ],
    formulae: [],
  },
  "y8-computing-threats-and-defences": {
    explanation:
      "Most successful attacks target people rather than technology. Phishing uses a convincing message to get credentials, social engineering manipulates someone into granting access, and malware covers viruses, worms, trojans, spyware and ransomware. Defences work in layers: authentication proves who you are, encryption makes intercepted data unreadable without the key, firewalls filter traffic, and updates close the weaknesses attackers rely on. A proportionate control matches the value of what is protected, since security that is too inconvenient will simply be bypassed by the people using it.",
    keyIdeas: [
      "Most attacks target people, not technology.",
      "Encryption protects data that has already been intercepted.",
      "Defences work in layers, not as a single barrier.",
      "Security too inconvenient to use will be bypassed.",
    ],
    formulae: [],
  },

  // ---- Computing, Year 9 -------------------------------------------------
  "y9-computing-programming-project": {
    explanation:
      "A project begins with analysis: what the program must do, who will use it, and what counts as success, written as requirements you can test against. Modular design then splits the work into subprograms with defined inputs and outputs, so each can be written and tested independently. Testing should be planned before coding, with normal, boundary and erroneous data, and each test recording what was expected and what happened. Documenting the improvements made in response to failed tests is as important as the code, because it shows the reasoning behind the finished program.",
    keyIdeas: [
      "Write testable requirements before writing code.",
      "Modular design lets parts be tested independently.",
      "Plan normal, boundary and erroneous test data.",
      "Record what failed and what you changed.",
    ],
    formulae: [],
  },
  "y9-computing-logic-gates-and-truth-tables": {
    explanation:
      "Logic gates implement Boolean operations in hardware. AND outputs 1 only when both inputs are 1; OR outputs 1 when at least one input is 1; NOT inverts its single input. A truth table lists every possible combination of inputs and the resulting output, so a circuit with two inputs has four rows and one with three inputs has eight. Circuits are built by combining gates, and evaluating an expression means working from the innermost brackets outwards, exactly as in arithmetic.",
    keyIdeas: [
      "AND needs both; OR needs at least one; NOT inverts.",
      "A truth table with $n$ inputs has $2^{n}$ rows.",
      "Work outwards from the innermost brackets.",
      "A circuit diagram and a Boolean expression say the same thing.",
    ],
    formulae: ["$n$ inputs give $2^{n}$ rows", "A AND B, A OR B, NOT A"],
  },
  "y9-computing-web-technologies-and-data": {
    explanation:
      "A web page is structured with HTML, which marks up meaning, and styled with CSS, which controls appearance; keeping them separate is what makes a site maintainable. Accessibility depends on that structure: headings in order, alternative text on images, sufficient colour contrast and keyboard operability. The web works on a client-server model, where a browser sends a request and a server returns a response, usually over HTTP or HTTPS, with HTTPS encrypting the exchange. Handling other people's data responsibly means collecting only what is needed, keeping it secure and being clear about what it is used for.",
    keyIdeas: [
      "HTML carries structure and meaning; CSS carries appearance.",
      "Accessible pages depend on correct structure, not on added features.",
      "Client sends a request; server returns a response.",
      "Collect the minimum data, and say what it is for.",
    ],
    formulae: [],
  },
  "y9-computing-artificial-intelligence-and-machine-learning": {
    explanation:
      "Most programs are rules a person wrote: if this, do that, and the computer follows them exactly. Machine learning works the other way round. You supply examples, and the program adjusts itself until it can produce the right answer for them, then applies whatever it settled on to examples it has never seen. In supervised learning the examples are labelled, so thousands of pictures are each marked cat or not cat, and training means repeatedly checking the model's guess against the label and nudging its internal numbers to reduce the error. Nobody writes the rule for what a cat looks like, and nobody can read it afterwards either, which is why these systems are hard to explain. That also makes them inherit whatever is in the data. A model trained on past hiring decisions learns the pattern of those decisions, including the unfair parts, and will repeat them while appearing neutral because it is a computer. A trained model produces the most likely answer given its data, which is not the same as a true one.",
    keyIdeas: [
      "A traditional program follows rules a person wrote; a model learns patterns from examples.",
      "Supervised learning needs labelled data, and lots of it.",
      "Training means reducing the error between the model's guess and the label.",
      "A model inherits the bias in its training data and looks neutral doing it.",
      "The output is the most likely answer, not a guaranteed correct one.",
    ],
    formulae: [],
  },
  "y9-computing-programming-languages-and-paradigms": {
    explanation:
      "A processor only executes machine code, which is binary. Assembly language gives those instructions short names such as ADD and LDA, one line per instruction, and is still tied to one kind of processor. High-level languages such as Python, C++ and Visual Basic read much more like English, let one line stand for many machine instructions, and run on any machine with a translator available. That translation happens in one of two ways: a compiler converts the whole program in advance and produces a file that runs fast but must be recompiled after every change, while an interpreter translates and runs line by line, which is slower but reports each error as it reaches it. Languages also differ in how you are expected to organise a solution. A procedural approach breaks a problem into subprograms that act on data passed to them; an object-oriented approach bundles the data and the operations on it together into objects. An IDE is the workshop rather than the language: an editor, a translator, a debugger that lets you stop the program and inspect its variables, and error highlighting as you type.",
    keyIdeas: [
      "Machine code is binary; assembly names those instructions; high-level languages abstract above both.",
      "A compiler translates everything first; an interpreter translates line by line as it runs.",
      "Procedural code separates data from the subprograms acting on it; object-oriented code bundles them.",
      "An IDE supplies the editor, translator and debugger, not the language itself.",
    ],
    formulae: [],
  },
  "y9-computing-ethics-law-and-the-environment": {
    explanation:
      "Computing is governed by law as well as by good practice: data protection law sets rules for handling personal data, computer misuse law makes unauthorised access an offence, and copyright law covers software and content. Algorithmic bias arises when a system trained on unrepresentative data produces systematically worse outcomes for some groups, and it is a design problem rather than a mysterious property of the technology. Computing also carries environmental costs in energy use, in the materials mined for devices, and in electronic waste. Evaluating an issue means naming the benefit, the cost and who bears each.",
    keyIdeas: [
      "Data protection, computer misuse and copyright each cover different ground.",
      "Bias usually comes from the data and the design choices.",
      "Devices carry costs in energy, materials and disposal.",
      "Say who benefits and who bears the cost.",
    ],
    formulae: [],
  },

  // ---- Computing, Year 10 (GCSE) -----------------------------------------
  "y10-computing-algorithms-and-efficiency": {
    explanation:
      "A linear search checks each item in turn and works on any list; a binary search repeatedly halves a sorted list and so finds an item in far fewer steps, but it requires the list to be sorted first. Bubble sort repeatedly swaps adjacent items that are out of order and is simple but slow; merge sort splits the list, sorts the halves and merges them, and is faster on large lists; insertion sort builds a sorted section one item at a time. Comparing efficiency at GCSE means comparing the number of steps and the memory used for a given input, and saying when each algorithm is the sensible choice. Tracing with a table of values is how you show an algorithm works.",
    keyIdeas: [
      "Binary search is faster but needs a sorted list.",
      "Bubble sort is simple and slow; merge sort is faster on large lists.",
      "Compare algorithms by steps taken and memory used.",
      "Trace with a table to demonstrate behaviour.",
    ],
    formulae: ["Binary search halves the list each pass", "Linear search checks up to $n$ items"],
  },
  "y10-computing-programming-techniques": {
    explanation:
      "The three programming constructs are sequence, selection and iteration, and every program is built from them. Iteration is either count-controlled with FOR, when the number of repetitions is known, or condition-controlled with WHILE, when it is not. Arrays store multiple values under one identifier accessed by index, and strings are manipulated by length, position, substring and concatenation operations. Subprograms with parameters and return values keep code reusable and readable, and a well-named subprogram documents itself.",
    keyIdeas: [
      "Sequence, selection and iteration build every program.",
      "FOR when the count is known; WHILE when it is not.",
      "Arrays are indexed, usually from zero.",
      "Subprograms make code reusable and self-documenting.",
    ],
    formulae: ["WHILE condition ... ENDWHILE", "array[index] accesses one element"],
  },
  "y10-computing-data-representation": {
    explanation:
      "Binary is base 2 and hexadecimal is base 16, and hexadecimal is used because one hex digit represents exactly four bits, so a byte is two hex digits and long binary strings become readable. Converting between them goes through the four-bit groups rather than through denary. File sizes are calculated from the components: an image from width, height and colour depth, and a sound file from sample rate, bit depth and duration. Compression reduces file size, either losslessly, so the original can be restored exactly, or lossily, which discards detail permanently to achieve a much smaller file.",
    keyIdeas: [
      "One hexadecimal digit represents exactly four bits.",
      "Convert binary to hex in groups of four bits.",
      "File size comes from the components that make up the file.",
      "Lossless can be restored exactly; lossy cannot.",
    ],
    formulae: [
      "Image size (bits) $=$ width $\\times$ height $\\times$ colour depth",
      "Sound size (bits) $=$ sample rate $\\times$ bit depth $\\times$ seconds",
      "$1$ byte $= 8$ bits",
    ],
  },
  "y10-computing-architecture-and-storage": {
    explanation:
      "The von Neumann architecture holds instructions and data in the same memory, and the CPU works through the fetch-decode-execute cycle using registers: the program counter holding the address of the next instruction, the memory address and data registers, and the accumulator. Performance depends on clock speed, on the number of cores, and on cache size, since cache holds frequently used data close to the CPU and avoids slower trips to main memory. Secondary storage is chosen by weighing capacity, speed, portability, durability and cost. Adding cores helps only if the software is written to use them.",
    keyIdeas: [
      "Fetch, decode, execute, using the program counter and accumulator.",
      "Clock speed, cores and cache all affect performance.",
      "Cache is small, fast memory close to the CPU.",
      "More cores help only if the software can use them.",
    ],
    formulae: ["Clock speed in hertz $=$ cycles per second"],
  },
  "y10-computing-networks-protocols-and-security": {
    explanation:
      "Networks are described by their scale, LAN or WAN, and by their topology: a star topology connects every device to a central switch and keeps working if one cable fails, while a mesh connects devices to each other and has no single point of failure. Protocols are agreed rules that let different systems communicate, and the common ones are worth knowing by job: HTTP and HTTPS for web pages, TCP/IP for routing and reliable delivery, SMTP, IMAP and POP for mail. Layering separates those jobs so one layer can change without breaking the others. Security controls include firewalls, encryption, authentication, access levels and penetration testing, and the right recommendation matches the threat.",
    keyIdeas: [
      "Star topology fails gracefully; mesh has no single point of failure.",
      "Each protocol has a specific job.",
      "Layering lets one layer change without breaking others.",
      "Match the security control to the threat.",
    ],
    formulae: [],
  },
  "y10-computing-testing-and-defensive-design": {
    explanation:
      "A syntax error breaks the rules of the language and stops the program running; a logic error lets it run but produces the wrong result, and only testing reveals it. Test data should cover normal values, boundary values at the edges of what is allowed, and erroneous values that should be rejected, and a test plan records what was expected alongside what happened. Defensive design anticipates misuse: validating input for presence, range, format and type, and authenticating users before granting access. Maintainability comes from meaningful names, comments where the reason is not obvious, indentation and modular structure.",
    keyIdeas: [
      "Syntax errors stop the program; logic errors produce wrong answers.",
      "Test with normal, boundary and erroneous data.",
      "Validation checks the form of input; authentication checks identity.",
      "Readable code is maintainable code.",
    ],
    formulae: [],
  },

  // ---- Computing, Year 11 (GCSE) -----------------------------------------
  "y11-computing-databases-and-sql": {
    explanation:
      "A relational database splits data into linked tables to avoid storing the same fact twice, which is what prevents inconsistency when data changes. A primary key uniquely identifies a record; a foreign key is a primary key from another table, and the pair creates the relationship. SQL retrieves data with SELECT naming the fields, FROM naming the table and WHERE filtering the records, with ORDER BY sorting the results. Validation rules protect data quality on entry, but they can only check that data is plausible, never that it is correct.",
    keyIdeas: [
      "Splitting into linked tables avoids duplicated facts.",
      "A foreign key matches a primary key in another table.",
      "SELECT fields FROM table WHERE condition.",
      "Validation checks plausibility, not truth.",
    ],
    formulae: ["SELECT field FROM table WHERE condition ORDER BY field"],
  },
  "y11-computing-boolean-logic-and-translators": {
    explanation:
      "Boolean expressions combine AND, OR and NOT, and simplifying one means finding a shorter expression with an identical truth table, which is checked by building the table rather than by inspection. A compiler translates an entire program into machine code in one go, producing a file that runs quickly and without the source; an interpreter translates and executes line by line, which makes testing easier but running slower. An assembler translates assembly language into machine code. Each translator suits a different stage of work, which is why development often uses an interpreter and release uses a compiler.",
    keyIdeas: [
      "Simplification is verified by an identical truth table.",
      "A compiler translates all at once; an interpreter line by line.",
      "Compiled code runs faster; interpreted code is easier to debug.",
      "An assembler translates assembly language to machine code.",
    ],
    formulae: ["$n$ inputs give $2^{n}$ rows in a truth table"],
  },
  "y11-computing-problem-solving-mastery": {
    explanation:
      "A substantial programming problem is solved by decomposing it into subprograms, deciding the data structures first, and writing the simplest version that works before adding features. Robust solutions validate their input, handle the cases where something is missing or out of range, and fail in a way that tells the user what went wrong. Maintainability is judged by whether someone else could change the program safely, which depends on naming, structure and comments explaining why rather than what. Evaluate a solution against the original requirements, not against how much effort it took.",
    keyIdeas: [
      "Decide the data structures before writing the code.",
      "Get the simplest working version first.",
      "Robust programs handle missing and out-of-range input.",
      "Evaluate against the requirements, not the effort.",
    ],
    formulae: [],
  },
  "y11-computing-operating-systems-and-utilities": {
    explanation:
      "An operating system manages the hardware on behalf of programs. Memory management allocates space to each process and keeps them separate, using virtual memory on disk when RAM runs short, which is slower. Process management shares CPU time between processes so that several appear to run at once. The OS also provides the user interface, manages files and peripherals, and controls user accounts and permissions. Utility software performs maintenance tasks such as backup, compression, defragmentation and malware scanning, which keep a system usable rather than adding features.",
    keyIdeas: [
      "The OS allocates memory and keeps processes separate.",
      "Virtual memory extends RAM onto disk, at a cost in speed.",
      "Process scheduling makes concurrent use possible.",
      "Utilities maintain the system rather than doing the user's work.",
    ],
    formulae: [],
  },
  "y11-computing-ethical-legal-and-environmental-impacts": {
    explanation:
      "Answers in this area are marked on the quality of reasoning, not on opinion. Name the relevant legislation and say what it actually requires, rather than gesturing at 'the law'. Privacy questions turn on what data is collected, whether the person knew, and what else it can be combined with; bias questions turn on the data a system learned from and the choices made in its design. Environmental impact covers manufacturing, energy use in operation and disposal. A justified conclusion weighs the identified benefits against the identified harms and says which is decisive, and why.",
    keyIdeas: [
      "Name the legislation and what it requires.",
      "Privacy turns on collection, consent and combination.",
      "Bias comes from training data and design decisions.",
      "Reach a conclusion and say what made it decisive.",
    ],
    formulae: [],
  },
  "y11-computing-computational-thinking-and-exam-skills": {
    explanation:
      "Trace tables are the most reliable marks in the paper: draw a column per variable, update a row per iteration, and never try to hold the values in your head. Technical vocabulary is assessed, so write 'iteration' rather than 'looping bit' and 'variable' rather than 'thing that stores'. Longer responses need planning: identify how many distinct points the marks imply and make that many, each developed rather than listed. Where a question says 'using the algorithm above', the answer must refer to that algorithm rather than to a general description.",
    keyIdeas: [
      "Draw the trace table; do not trace mentally.",
      "Use precise technical vocabulary: it is assessed.",
      "Let the mark allocation tell you how many points to make.",
      "Answer about the algorithm given, not one in general.",
    ],
    formulae: [],
  },

  // ---- Design Technology, Year 7 -----------------------------------------
  "y7-design-technology-user-needs-and-iterative-design": {
    explanation:
      "Design starts with a user and a need, not with an idea for a product. Research establishes who the user is and what the problem actually is, using observation, interviews and the study of existing products. A design brief states the problem and the intent in a sentence or two, and a specification turns it into measurable requirements such as size, weight, cost and safety. Iterative design means making something, testing it with users, and improving it, repeating the cycle, which produces better outcomes than trying to get a single idea right first time.",
    keyIdeas: [
      "Start from a user and a need, not from a product idea.",
      "A brief states the problem; a specification makes it measurable.",
      "Iteration: make, test, improve, repeat.",
      "Feedback from real users beats designer opinion.",
    ],
    formulae: [],
  },
  "y7-design-technology-materials-tools-and-safety": {
    explanation:
      "Materials fall into families - timbers, metals, polymers, textiles, papers and boards - and each has properties that make it suitable or unsuitable for a job. The properties that usually decide a choice are strength, hardness, toughness, ductility, malleability, durability and cost, and they should be named rather than described as 'strong' or 'good'. Tools are chosen for the material and the operation, with marking out done accurately before cutting because material removed cannot be replaced. Workshop safety means the correct personal protective equipment, guards in place, a clear workspace and knowing where the emergency stop is.",
    keyIdeas: [
      "Name the property that makes a material suitable.",
      "Mark out accurately before cutting.",
      "Match the tool to the material and the operation.",
      "PPE, guards, clear space, and know the emergency stop.",
    ],
    formulae: [],
  },
  "y7-design-technology-technical-drawing-and-cad": {
    explanation:
      "Technical drawing communicates a design precisely enough to be made by someone who has never seen it. Orthographic projection shows the front, plan and side views arranged in a standard layout, each in proportion and to a stated scale. Dimensions are added once only, in millimetres, on extension and dimension lines placed outside the outline so the drawing stays readable. CAD produces the same information as an editable model that can be measured, altered and sent to CAM equipment, which is why industry has largely moved to it.",
    keyIdeas: [
      "Orthographic shows front, plan and side in a standard arrangement.",
      "Dimension once, in millimetres, outside the outline.",
      "State the scale on the drawing.",
      "CAD models are editable and drive CAM machines.",
    ],
    formulae: ["Scale $1:2$ means the drawing is half the real size"],
  },
  "y7-design-technology-food-hygiene-and-healthy-eating": {
    explanation:
      "Most food poisoning comes from bacteria that were already present and were given warmth, moisture and time to multiply. That is why the rules are what they are: wash hands before and after handling raw meat, keep raw and cooked food apart so nothing drips from one to the other, chill below 5 degrees and cook through above 75, and never leave food standing in the danger zone between them. Cross-contamination is the one most often missed, because a board or a knife carries bacteria just as readily as a hand. Knife safety is a grip and a posture: the claw grip with fingertips tucked back, a board that cannot slide, and cutting away from yourself. A balanced diet is about proportion rather than any single food being good or bad. Carbohydrates supply most of the energy, protein builds and repairs, fats provide concentrated energy and carry some vitamins, and fibre, vitamins, minerals and water keep the system working. The Eatwell Guide shows those proportions on a plate, which is easier to act on than a list.",
    keyIdeas: [
      "Bacteria need warmth, moisture and time, so remove one of them.",
      "Keep raw and cooked food apart; the board and knife carry bacteria too.",
      "Chill below 5 degrees, cook above 75, and do not leave food between them.",
      "Carbohydrate for energy, protein to build and repair, fat for stored energy.",
      "Balance is about proportion, not about any one food being forbidden.",
    ],
    formulae: [],
  },
  "y7-design-technology-forces-and-structures": {
    explanation:
      "Structures carry loads, and the forces involved are tension pulling apart, compression squashing together, bending, shear and torsion twisting. A structure fails where the force exceeds what the material and shape can carry, so the shape matters as much as the material. Triangulation stiffens a frame because a triangle cannot change shape without changing the length of a side, which is why bracing is added to rectangular frames. Testing a structure means loading it in a controlled and repeatable way and recording where and how it failed.",
    keyIdeas: [
      "Tension pulls, compression squashes, shear slides, torsion twists.",
      "Shape carries load as much as material does.",
      "A triangle cannot deform without changing a side length.",
      "Test by loading repeatably and recording the failure.",
    ],
    formulae: [],
  },

  // ---- Design Technology, Year 8 -----------------------------------------
  "y8-design-technology-motion-and-mechanisms": {
    explanation:
      "Mechanisms convert one kind of motion into another. The four types of motion are linear in a straight line, reciprocating backwards and forwards, oscillating swinging about a point, and rotary turning. Levers change the size and direction of a force about a pivot, and the class of lever depends on where the effort, load and pivot sit. Gears and pulleys change speed and torque together: a larger driven gear turns more slowly with more turning force, and the ratio comes from the tooth counts.",
    keyIdeas: [
      "Linear, reciprocating, oscillating and rotary describe all motion.",
      "Levers trade force against distance about a pivot.",
      "A larger driven gear means slower rotation and more torque.",
      "Gear ratio comes from the tooth counts.",
    ],
    formulae: [
      "Gear ratio $= \\frac{\\text{teeth on driven gear}}{\\text{teeth on driver gear}}$",
      "Mechanical advantage $= \\frac{\\text{load}}{\\text{effort}}$",
    ],
  },
  "y8-design-technology-electronic-systems": {
    explanation:
      "An electronic system is described as input, process and output, which makes a circuit understandable before any component is named. Inputs are sensors such as switches, LDRs and thermistors; processing is done by resistors, transistors or a microcontroller; outputs include LEDs, buzzers and motors. Circuit diagrams use standard symbols so that a circuit can be read by anyone, and components must be connected the right way round where polarity matters. Testing means checking behaviour against what the system was meant to do, one stage at a time.",
    keyIdeas: [
      "Describe any circuit as input, process, output.",
      "LDRs and thermistors change resistance with conditions.",
      "Standard symbols make a diagram universally readable.",
      "Test one stage at a time against the intended behaviour.",
    ],
    formulae: ["$V = IR$"],
  },
  "y8-design-technology-textiles-and-modern-materials": {
    explanation:
      "Textile fibres are natural, such as cotton and wool, or synthetic, such as polyester and nylon, and their properties - absorbency, strength, warmth, elasticity, ease of care - decide what they suit. Fabrics are constructed by weaving, knitting or bonding, and the construction affects stretch and fraying as much as the fibre does. Joining and finishing accurately matters: seam allowance, straight stitching and a neatened edge determine whether a product lasts. Modern and smart materials, such as thermochromic pigments or shape-memory alloys, respond to their environment and open design possibilities that conventional materials cannot.",
    keyIdeas: [
      "Fibre and construction together determine fabric behaviour.",
      "Match the property to the use: absorbency, stretch, durability.",
      "Accurate seams and finishes decide whether a product lasts.",
      "Smart materials respond to an environmental change.",
    ],
    formulae: [],
  },
  "y8-design-technology-cooking-skills-and-food-provenance": {
    explanation:
      "Cooking is the controlled use of heat, and the method changes the result. Boiling and simmering cook in water, so flavour leaches out unless you keep the liquid; frying is hotter and drier, browning the surface and creating flavours that simply do not form in water; baking surrounds food with dry heat so it rises and sets. Heat also makes food safe and easier to digest. Provenance means knowing where an ingredient came from and what producing it involved: whether it was grown, reared or caught, how far it travelled, what season it belongs to, and how the animals or the land were treated. Those questions rarely have a single clean answer. A tomato grown locally in a heated greenhouse in January can carry a larger carbon cost than one shipped from Spain; free-range welfare standards usually mean a higher price and more land. Being able to hold several perspectives at once, and still make a decision, is what the topic is really asking of you.",
    keyIdeas: [
      "Wet heat, dry heat and fat-based heat produce different textures and flavours.",
      "Cooking makes food safe as well as palatable.",
      "Provenance covers how food is grown, reared, caught and transported.",
      "Local is not automatically lower impact than imported.",
      "Welfare, environment and cost usually pull against each other.",
    ],
    formulae: [],
  },
  "y8-design-technology-sustainable-cad-cam": {
    explanation:
      "CAD produces an accurate digital model, and CAM uses that model to control manufacturing equipment such as laser cutters, 3D printers and CNC routers, which gives repeatable accuracy and easy modification. Preparing a model for CAM means working to real dimensions, allowing for the width of the cutting tool, and nesting parts to use material efficiently. A life-cycle analysis considers the environmental impact at every stage: raw material extraction, manufacture, distribution, use and disposal. The most effective sustainability decisions are usually made at the design stage, through material choice and by designing for repair and disassembly.",
    keyIdeas: [
      "CAM manufactures directly from the CAD model.",
      "Allow for tool width and nest parts to save material.",
      "A life-cycle analysis covers extraction to disposal.",
      "Design decisions determine most of the environmental impact.",
    ],
    formulae: [],
  },

  // ---- Design Technology, Year 9 -----------------------------------------
  "y9-design-technology-programmable-control": {
    explanation:
      "A programmable control system uses a microcontroller to read sensors and drive outputs according to a program, which means behaviour can be changed without rewiring. Sensor choice follows from what needs detecting: an LDR for light, a thermistor for temperature, a switch for position or contact. Control logic is usually a loop that reads inputs, applies conditions and sets outputs, and flowcharts express it clearly before coding. Testing an interactive prototype means checking each condition deliberately, including the edge cases, rather than trying it once and assuming it works.",
    keyIdeas: [
      "A microcontroller changes behaviour without rewiring.",
      "Choose the sensor from what must be detected.",
      "Express the logic as a flowchart before coding.",
      "Test each condition, including the edge cases.",
    ],
    formulae: [],
  },
  "y9-design-technology-precision-manufacture": {
    explanation:
      "A manufacturing plan lists the operations in order, with the tools, equipment and quality checks for each, so that someone else could make the product consistently. Tolerance states the permitted variation on a dimension, written as a range or with plus and minus limits, and it exists because no process is exact; tighter tolerances cost more. Quality control checks the product during and after manufacture using jigs, templates and gauges, while quality assurance covers the whole system that makes quality likely. Recording the checks is what makes consistency demonstrable.",
    keyIdeas: [
      "A plan is ordered operations plus tools and checks.",
      "Tolerance is the permitted variation, and it costs money to tighten.",
      "Jigs, templates and gauges make checks fast and repeatable.",
      "Quality control checks products; quality assurance covers the system.",
    ],
    formulae: ["Tolerance: $50 \\pm 0.5$ mm means 49.5 mm to 50.5 mm"],
  },
  "y9-design-technology-inclusive-and-user-centred-design": {
    explanation:
      "Inclusive design aims to make a product usable by as many people as possible without a separate special version, which usually improves it for everyone. A user profile describes the intended user concretely - age, ability, context of use, constraints - so that design decisions can be tested against a real person rather than an imagined average. Anthropometric data gives body measurements across a population, and ergonomics applies it so that a product fits the user; designing to percentile ranges rather than the mean is what makes the fit work for most people. Accessibility is evaluated by testing with users who have different needs.",
    keyIdeas: [
      "Inclusive design avoids a separate 'special' version.",
      "A user profile makes decisions testable.",
      "Use percentile ranges, not the average, for fit.",
      "Evaluate accessibility by testing with real users.",
    ],
    formulae: ["Design between the 5th and 95th percentile to fit most users"],
  },
  "y9-design-technology-product-analysis-and-improvement": {
    explanation:
      "Disassembling a product reveals decisions that are invisible from outside: how parts are joined, what material each is, how it was manufactured and how it would be repaired. Analysis works through function, whether it does its job; manufacture, how it was made and at what scale; materials, why each was chosen; and sustainability, how it ends its life. Improvements must be justified against the original purpose and the user, with a reason rather than a preference. A proposal is stronger when it says what it would cost or compromise as well as what it would gain.",
    keyIdeas: [
      "Disassembly exposes joining, materials and manufacture.",
      "Analyse function, manufacture, materials and sustainability.",
      "Justify improvements against purpose and user.",
      "State the trade-off, not just the benefit.",
    ],
    formulae: [],
  },

  // ---- Design Technology, Year 10 (GCSE) ---------------------------------
  "y10-design-technology-materials-and-their-properties": {
    explanation:
      "GCSE requires knowledge of material families - papers and boards, natural and manufactured timbers, ferrous and non-ferrous metals, thermoforming and thermosetting polymers, textiles and composites - and of what distinguishes them. Physical properties such as density, conductivity and absorbency are distinguished from mechanical properties such as tensile strength, hardness, toughness, ductility and malleability, and a justified choice names the specific property required. Stock forms matter commercially: sheet, bar, tube, rod and moulding powder determine what processes are available and how much waste is produced. Selecting a material means balancing property, cost, availability and environmental impact.",
    keyIdeas: [
      "Thermoforming polymers can be reshaped; thermosetting ones cannot.",
      "Ferrous metals contain iron and rust; non-ferrous do not.",
      "Physical and mechanical properties are different categories.",
      "Stock form determines available processes and waste.",
    ],
    formulae: [],
  },
  "y10-design-technology-energy-systems-and-mechanisms": {
    explanation:
      "Systems are analysed as input, process and output, and a block diagram shows that flow without committing to components. Mechanical systems change the magnitude, direction or type of motion, and mechanical advantage measures the force multiplication a lever or pulley provides. Energy generation is compared as renewable - wind, solar, tidal, hydro, biomass - and non-renewable, weighing availability, cost, carbon emissions and the practicalities of storage. A justified energy choice refers to the application rather than to which source is best in general.",
    keyIdeas: [
      "Block diagrams show input, process and output.",
      "Mechanical advantage is load divided by effort.",
      "Renewable and non-renewable sources differ in more than emissions.",
      "Justify an energy choice for the application in hand.",
    ],
    formulae: [
      "Mechanical advantage $= \\frac{\\text{load}}{\\text{effort}}$",
      "Velocity ratio $= \\frac{\\text{distance moved by effort}}{\\text{distance moved by load}}$",
    ],
  },
  "y10-design-technology-new-and-emerging-technologies": {
    explanation:
      "New products reach us in two ways. Technology push is where a development in the laboratory comes first and a use is found for it afterwards, which is how the microwave oven arrived. Market pull is where a demand already exists and designers respond to it. Most real products involve both. Once a product exists, how long it is meant to last is also a design decision. Planned obsolescence builds in a limited life, through a battery that cannot be replaced or a part that is no longer made, which guarantees repeat sales and generates waste; designing for repair does the opposite, with standard fixings, replaceable parts and published instructions. Manufacturing has changed just as much. Automation and robotics took over repetitive and dangerous tasks, raising consistency and output while removing many jobs and creating fewer, more technical ones. Flexible manufacturing systems let a line switch between products rather than making one thing. Just in time keeps almost no stock, delivering components as they are needed, which cuts storage cost and leaves no cushion when a supplier fails. Lean manufacturing is the wider effort to remove anything the customer would not pay for.",
    keyIdeas: [
      "Technology push starts with the invention; market pull starts with the demand.",
      "Planned obsolescence shortens a product's life on purpose; design for repair extends it.",
      "Automation raises consistency and output and changes what the workforce does.",
      "Just in time removes storage cost and removes the buffer against failure.",
      "Lean manufacturing removes anything the customer would not pay for.",
    ],
    formulae: [],
  },
  "y10-design-technology-investigation-and-design-brief": {
    explanation:
      "Investigation gathers evidence about the user and the context before any designing happens, using primary research such as interviews, observation and testing, and secondary research such as existing product analysis and standards. Analysing existing products identifies what works, what fails and where an opportunity lies. The brief states the problem and the intent; the specification turns it into measurable, testable requirements covering function, size, materials, cost, safety and sustainability. A specification point that cannot be tested - 'must look modern' - is a wish rather than a requirement.",
    keyIdeas: [
      "Primary research is collected by you; secondary already exists.",
      "Analyse existing products for what fails, not just what works.",
      "A specification point must be measurable and testable.",
      "The brief states intent; the specification states requirements.",
    ],
    formulae: [],
  },
  "y10-design-technology-generating-and-developing-ideas": {
    explanation:
      "Generating ideas well means producing genuinely different concepts rather than variations on the first one, using techniques such as sketching, morphological analysis and taking inspiration from other contexts. Development is where an idea becomes a design: modelling in card, foam or CAD tests proportion, function and assembly cheaply before committing to material. Annotation carries the reasoning and is where marks are earned, explaining why a choice was made rather than labelling what is drawn. User feedback should be sought on models and acted on visibly, so that the design can be seen to have changed for a reason.",
    keyIdeas: [
      "Generate genuinely different concepts, not variations of one.",
      "Model cheaply to test proportion, function and assembly.",
      "Annotation explains why, not what.",
      "Show the design changing in response to feedback.",
    ],
    formulae: [],
  },
  "y10-design-technology-processes-and-quality": {
    explanation:
      "Processes are grouped as wasting, which removes material by cutting or machining; shaping, which forms it by moulding, casting or bending; joining, whether permanent or temporary; and finishing, which protects or improves appearance. The right process depends on the material, the form required and the scale of production, since one-off, batch, mass and continuous production have very different economics. A production plan sequences the operations with timings, tools and quality checks. Tolerances state the acceptable variation, and quality checks at defined points catch errors before further value is added.",
    keyIdeas: [
      "Wasting, shaping, joining and finishing cover the processes.",
      "Scale of production changes which process is economic.",
      "A production plan sequences operations with checks and timings.",
      "Check early, before more value is added to a faulty part.",
    ],
    formulae: [],
  },
  "y10-design-technology-people-society-and-environment": {
    explanation:
      "Design decisions have consequences beyond the product. The six Rs - rethink, refuse, reduce, reuse, repair, recycle - are a practical hierarchy, with the earlier ones having far more effect than recycling at the end. A life-cycle assessment traces impact from raw material extraction, through manufacture and distribution, to use and disposal, and it often shows that the use phase or the material choice dominates. Inclusive design widens who can use a product, and responsible innovation weighs benefits against social and environmental costs and asks who carries each.",
    keyIdeas: [
      "The six Rs are a hierarchy: rethinking beats recycling.",
      "A life-cycle assessment often shows one stage dominating.",
      "Inclusive design widens the user group without a separate version.",
      "Ask who gains and who bears the cost of an innovation.",
    ],
    formulae: [],
  },

  // ---- Design Technology, Year 11 (GCSE) ---------------------------------
  "y11-design-technology-prototype-manufacture": {
    explanation:
      "Manufacturing the prototype is where the production plan is tested against reality, and following it - while recording where it had to change - is part of the assessment. Specialist tools and machinery must be used safely and correctly, with the right PPE, guards and settings for the material. Accuracy comes from marking out carefully, using jigs and templates for repeated operations, and checking dimensions against the tolerance as you go rather than at the end. Recording quality control decisions, including what was rejected and why, demonstrates control of the process.",
    keyIdeas: [
      "Follow the plan, and record where reality forced a change.",
      "Safe use of specialist equipment is assessed.",
      "Jigs and templates make repeated operations accurate.",
      "Check against tolerance during manufacture, not after.",
    ],
    formulae: [],
  },
  "y11-design-technology-testing-and-evaluation": {
    explanation:
      "A test is only useful if it measures something the specification asked for, so tests are designed directly from the specification points and produce evidence rather than impressions. Objective tests give numbers - load carried, time taken, dimensions achieved - while user testing gives feedback that should be gathered from the intended user group rather than from whoever is nearby. Evaluation compares the outcome against each specification point honestly, including those not met. Suggested modifications should be specific and justified, and a good evaluation is worth more when it is candid about failure.",
    keyIdeas: [
      "Design tests from the specification points.",
      "Objective tests produce numbers; user tests need the right users.",
      "Evaluate against every specification point, including failures.",
      "Modifications must be specific and justified.",
    ],
    formulae: [],
  },
  "y11-design-technology-materials-processes-and-manufacture": {
    explanation:
      "Scale of production shapes every manufacturing decision: one-off production allows flexibility and high skill input, batch production suits changeable quantities with jigs and set-ups, mass production justifies expensive tooling, and continuous production runs without interruption for the highest volumes. Process selection follows from the material, the form and the quantity, and the same part may be made quite differently at different scales. Material treatments and finishes exist for reasons - hardening and tempering to change mechanical properties, seasoning timber to control moisture, galvanising and powder coating to resist corrosion - and should be justified by the property required.",
    keyIdeas: [
      "One-off, batch, mass and continuous production suit different volumes.",
      "The same part is made differently at different scales.",
      "Treatments change properties; finishes protect and improve appearance.",
      "Justify a treatment by the property it delivers.",
    ],
    formulae: [],
  },
  "y11-design-technology-mechanisms-electronics-and-control": {
    explanation:
      "Mechanical advantage and velocity ratio quantify what a mechanism does, and gear and pulley ratios follow from tooth counts or diameters, with a compound gear train multiplying the ratios of its stages. Electronic circuits are analysed as input, process and output, with sensors providing input and the process stage implemented by discrete components or a microcontroller. Programmable control gives flexibility, because behaviour is changed in software rather than by rewiring, and it allows conditions and timing to be handled precisely. Calculations should always be followed by a statement of what the result means for the product.",
    keyIdeas: [
      "Gear ratio comes from tooth counts; compound trains multiply.",
      "Analyse circuits as input, process, output.",
      "Programmable control changes behaviour in software.",
      "Say what a calculated value means for the product.",
    ],
    formulae: [
      "Gear ratio $= \\frac{\\text{driven teeth}}{\\text{driver teeth}}$",
      "Mechanical advantage $= \\frac{\\text{load}}{\\text{effort}}$",
      "Output speed $= \\frac{\\text{input speed}}{\\text{gear ratio}}$",
    ],
  },
  "y11-design-technology-quantitative-design-skills": {
    explanation:
      "Design work carries real mathematics, and it is directly assessed. Area and volume calculations size materials and estimate quantity and cost, and compound shapes are handled by splitting them. Ratios scale drawings and models and express gear and pulley relationships. Tolerances are stated as limits and checked against measurements, and percentage waste is calculated from the material used against the material bought. Data from testing - loads, times, measurements - is interpreted by comparing it to the specification, quoting figures rather than describing the result in general terms.",
    keyIdeas: [
      "Split a compound shape before calculating area or volume.",
      "Ratios scale drawings and describe gear relationships.",
      "Check measurements against stated tolerance limits.",
      "Quote figures when interpreting test data.",
    ],
    formulae: [
      "Volume of a cuboid $= l \\times w \\times h$",
      "Cylinder volume $= \\pi r^{2}h$",
      "Percentage waste $= \\frac{\\text{material wasted}}{\\text{material bought}} \\times 100$",
    ],
  },
  "y11-design-technology-design-decisions-and-exam-practice": {
    explanation:
      "Product analysis questions supply an unfamiliar product and ask for judgements about materials, manufacture and user needs, so the skill is applying general knowledge to something you have not seen before. Sketching under exam conditions must communicate rather than impress: clear proportions, a note of scale, and annotation carrying the justification. Longer answers are marked on justified decisions, so every claim needs a reason attached - a material named with the property that makes it suitable, a process named with the scale that makes it economic. Read the command word, and let the marks tell you how many developed points are expected.",
    keyIdeas: [
      "Apply general knowledge to an unfamiliar product.",
      "Sketches must communicate; annotation carries the marks.",
      "Attach a reason to every design decision.",
      "Let the mark allocation set the number of developed points.",
    ],
    formulae: [],
  },
};
