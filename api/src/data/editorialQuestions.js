// Editorial corrections, verified against the database. Not formal teacher approval.
// Regenerate with node api/scripts/persist-editorial-source.mjs after applying reviewed plans.
export const editorialQuestions = {
  "y10-computing-algorithms-and-efficiency/exam-0-AQA-core": {
    "question": "A list of eight numbers is given in the following order: 7, 2, 9, 4, 1, 6, 5, 8. The topic is \"Use searching and sorting\" within Algorithms and Efficiency. Answer all parts: (a) Using a linear search on this list, determine whether the value 5 is in the list and, if it is, give its position in the list (counting from 1). How many comparisons were made? (b) Sort the list into ascending order using the insertion sort algorithm and write down the new order of the numbers. (c) Using binary search with the lower middle position whenever there are two middle items on the sorted list from part (b), determine whether 6 is in the list and, if it is, give its position and how many comparisons were made. (d) Which method would be more efficient for finding a single value in an already sorted list of 1000 numbers: linear search or binary search? Explain briefly.",
    "marks": 4,
    "markScheme": [
      "Correctly states that 5 is found at position 7 and that 7 comparisons were made in the linear search.",
      "Writes the final sorted order as 1, 2, 4, 5, 6, 7, 8, 9.",
      "Finds 6 at position 5 after comparing with 5, then 7, then 6: three comparisons.",
      "Binary search halves the remaining interval and needs at most 10 comparisons for 1000 sorted items; linear search may need 1000."
    ],
    "answer": "a) 5 is at position 7: seven linear-search comparisons. b) Sorted order: 1, 2, 4, 5, 6, 7, 8, 9. c) With the lower-middle convention, compare 5, then 7, then 6: three comparisons, found at position 5. d) Binary search is more efficient on the already sorted 1000-item list, needing at most 10 comparisons. Sorting an unsorted list first would add work.",
    "notation": false
  },
  "y10-computing-algorithms-and-efficiency/exam-4-AQA-core": {
    "question": "For [7, 3, 5, 2, 9, 1], compare bubble, insertion and top-down merge sort. Count only comparisons of data values and writes to array positions, not scalar assignments or loop tests. Bubble sort uses shrinking passes of lengths 5,4,3,2,1 with no early exit; a swap writes twice to the array. Insertion sort saves a key, shifts larger values right and writes the key once per insertion. Merge sort splits each block using a left half of floor(length/2), compares until one half is exhausted, writes all merged elements to a temporary array and then copies them back. Give comparisons, array writes and totals, treating each counted operation as equal cost.",
    "marks": 6,
    "markScheme": [
      "Correctly states the total number of comparisons for bubble sort on the given array.",
      "Correctly counts the total data moves for bubble sort, treating each swap as three moves.",
      "Correctly states the total number of comparisons for insertion sort and shows the per-step counts.",
      "Correctly states the total data moves for insertion sort and shows the per-step counts.",
      "Correctly states the total number of comparisons for merge sort and shows the total number of moves.",
      "Correctly compares the three totals to identify the most efficient algorithm for this input and provides a justified reason."
    ],
    "answer": "Bubble: 15 comparisons and 10 swaps; two array writes per swap give 20 writes, total 35. Insertion: comparisons per insertion 1,2,3,1,5, total 12; array writes 2,2,4,1,6, total 15; combined total 27. Merge: the successive merges [3]+[5], [7]+[3,5], [9]+[1], [2]+[1,9], and [3,5,7]+[1,2,9] use 1,2,1,2,5 comparisons, total 11; writes are 4,6,4,6,12, total 32; combined total 43. Insertion has the lowest count under this stated model. A swap can be written `temp=a[i]; a[i]=a[j]; a[j]=temp`; only the final two assignments are array writes.",
    "notation": false
  },
  "y10-computing-algorithms-and-efficiency/exam-4-Edexcel-core": {
    "question": "For the list [7, 2, 9, 4, 3], outline how bubble sort, insertion sort and merge sort produce ascending order. Give the state after the first left-to-right bubble pass, the state after inserting the second item in insertion sort, and the two sorted halves just before the final merge. Explain why exact speed cannot be inferred from the algorithm names alone for this small list.",
    "marks": 5,
    "markScheme": [
      "First bubble pass gives [2, 7, 4, 3, 9].",
      "First insertion gives [2, 7, 9, 4, 3].",
      "Splitting into [7,2] and [9,4,3] gives sorted halves [2,7] and [3,4,9].",
      "Final order is [2,3,4,7,9].",
      "Actual speed depends on the implementation and operation costs; small-list overhead matters."
    ],
    "answer": "Bubble’s first pass moves 9 to the end: [2,7,4,3,9]. Insertion first moves 2 before 7: [2,7,9,4,3], then inserts later values into the growing sorted prefix. Merge sort can split into [7,2] and [9,4,3], sort them to [2,7] and [3,4,9], then merge. All finish at [2,3,4,7,9]. Exact comparison/move counts need specified implementations, and measured speed also depends on overhead.",
    "notation": false
  },
  "y10-computing-algorithms-and-efficiency/exam-5-Edexcel-core": {
    "question": "Explain, using a concrete example, the efficiency of two search algorithms when finding a value in a sorted list of 25 numbers: a linear search and a binary search. In your answer, state the maximum number of items each algorithm would inspect in the worst case for this list, and give a brief explanation of why binary search is more efficient as the list size grows. Assume the list is sorted for binary search.",
    "marks": 4,
    "markScheme": [
      "Linear search inspects every item in the worst case; for a 25-item list this is 25 items.",
      "Binary search inspects at most 5 items in the worst case for a 25-item list, because each comparison halves the remaining possibilities (25 -> 12 -> 6 -> 3 -> 1 -> 0).",
      "Binary search is more efficient for larger lists because halving the search space at each step leads to far fewer checks than inspecting items one by one.",
      "Binary search requires the list to be sorted; if the list is not sorted, binary search cannot be used."
    ],
    "answer": "A linear search checks each item until it finds the value or reaches the end; for a list of 25 numbers, the worst case is that it inspects 25 items. A binary search, which must be applied to a sorted list, checks the middle item first and then halves the remaining possibilities each time; for 25 items this requires at most 5 checks (sequence of halving: 25 -> 12 -> 6 -> 3 -> 1 -> 0). Therefore, binary search is more efficient than a linear search for this size of list because the number of checks grows much more slowly as the list grows. Note that binary search only works if the list is sorted; if it is not sorted, binary search cannot be used.",
    "notation": false
  },
  "y10-computing-algorithms-and-efficiency/exam-9-Edexcel-core": {
    "question": "The following pseudocode is intended to sum all numbers in the list values that are greater than 10. The list to process is values = [3, 12, 7, 15, 2]. The algorithm has a bug in the loop condition that could cause an error or an incorrect result. Trace the execution of the algorithm for the given list, writing the values of sum and i after each step. Identify the bug and provide a corrected version of the loop. Finally, state the value that will be printed by the corrected algorithm.\n\nIndices start at zero. Faulty pseudocode:\n```text\nsum = 0\ni = 0\nWHILE i <= length(values)\n    IF values[i] > 10 THEN\n        sum = sum + values[i]\n    END IF\n    i = i + 1\nEND WHILE\nPRINT sum\n```",
    "marks": 3,
    "markScheme": [
      "Identifies that the loop condition uses ≤ length(values) instead of < length(values), which would cause an extra iteration and possible out-of-bounds access.",
      "Provides the corrected loop header: WHILE i < length(values) DO (or FOR i = 0 to length(values) - 1), and notes the valid index range.",
      "States the final value printed by the corrected algorithm is 27."
    ],
    "answer": "After each valid iteration, (i, sum) is (1, 0), (2, 12), (3, 12), (4, 27), (5, 27). The faulty condition permits another iteration at i = 5, but valid indices are 0 to 4, so values[5] is out of bounds. Replace `i <= length(values)` with `i < length(values)`. The corrected algorithm stops after the five valid iterations and prints 27.",
    "notation": false
  },
  "y10-computing-algorithms-and-efficiency/practice-5-Edexcel-core": {
    "question": "Question 6: Compare the efficiency of two algorithms for an input size n = 150. Algorithm A uses a quadratic approach and took 2.25 seconds; Algorithm B uses a linear approach and took 1.50 seconds. (a) Which algorithm is more efficient for this input size? (b) By what factor is the faster algorithm quicker? (c) If the input size were increased to n = 300, explain which algorithm would become more efficient and why.",
    "hint": "Think about how the times would change if n doubles.",
    "working": [
      "Step 1: Note the given times: Algorithm A = 2.25 s, Algorithm B = 1.50 s.",
      "Step 2: Since the smaller time is more efficient for this input size, Algorithm B is more efficient than Algorithm A.",
      "Step 3: Calculate the factor: 2.25 ÷ 1.50 = 1.5, so Algorithm B is 1.5 times faster than Algorithm A for n = 150.",
      "Step 4: If n doubles to 300, A (quadratic) would grow by a factor of 4 (since time ∝ n^2) and B (linear) would grow by a factor of 2 (since time ∝ n); therefore, Algorithm B becomes even more efficient relative to Algorithm A."
    ],
    "answer": "At n = 150, B is faster: 2.25/1.50 = 1.5 times as fast. Under the stated proportional growth model, doubling n makes A take 4 × 2.25 = 9 seconds and B take 2 × 1.50 = 3 seconds. B remains faster and is then three times as fast. Actual measured timings may include other overheads.",
    "notation": false
  },
  "y10-computing-architecture-and-storage/exam-9-AQA-core": {
    "question": "Question 10 (AQA GCSE) Describe the fetch-decode-execute cycle in a simplified CPU model. In your answer, explain what happens to the programme counter (PC), the memory address register (MAR), the memory data register (MDR), the instruction register (IR), and the arithmetic logic unit (ALU) during the fetch, decode and execute stages. Include a short, concrete example to show how a single instruction is processed and how the cycle repeats for the next instruction. For example, assume the programme counter currently points to address 204 and memory[204] contains the instruction “ADD the immediate value 5 to A”.",
    "marks": 4,
    "markScheme": [
      "Fetch stage: PC provides the address to MAR; memory at MAR is read into MDR; data in MDR is loaded to IR; PC is incremented to point to the next instruction.",
      "Decode stage: The instruction in IR is interpreted to identify the operation and its operands.",
      "Execute stage: The CPU carries out the operation, using the ALU or memory as needed (e.g., adding a value to the accumulator A) and stores the result back as required.",
      "Repetition: After execution, PC points to the next instruction and the fetch-decode-execute cycle starts again."
    ],
    "answer": "The fetch-decode-execute cycle is how the CPU processes one instruction, repeated over and over for every instruction in a programme. Fetch: The programme counter (PC) holds the address of the next instruction. This address is loaded into the memory address register (MAR). The memory location at MAR is read and its data is placed in the memory data register (MDR). The data in MDR is then transferred to the instruction register (IR). The PC is incremented so it points to the address of the subsequent instruction. Decode: The CPU examines the instruction in IR to determine what operation is required and which operands are used (for example, which memory location or which register provides data). Execute: The CPU carries out the operation. This may involve the arithmetic logic unit (ALU) performing a calculation, or moving data between registers, or reading or writing memory. The result is stored where the instruction specifies (for example, updating the accumulator A). Repeat: After the execute stage, the PC now points to the next instruction, and the process begins again with the next fetch. Example: If memory[204] contains the instruction “ADD 5 to A”, then Fetch: PC = 204; MAR <- 204; memory[204] -> MDR; IR <- MDR; PC <- 205. Decode: The instruction in IR is interpreted as the operation ADD with the operand 5. Execute: The ALU adds the immediate value 5 to the accumulator A and stores the result back in A. Repeat: PC now points to 205; the next instruction at memory[205] will be fetched in the next cycle.",
    "notation": false
  },
  "y10-computing-architecture-and-storage/practice-9-AQA-core": {
    "question": "Question 10. Describe how three CPU components—the Control Unit (CU), the Arithmetic Logic Unit (ALU) and three registers Reg1, Reg2 and Reg3—work together to add the values stored in Reg1 and Reg2. The scenario assumes Reg1 and Reg2 currently contain numbers to be added, and Reg3 will hold the result. In your answer, state the role of the CU in fetching and decoding the instruction and preparing data movement, the role of the ALU in performing the addition, where the sum is stored, and how the next instruction is selected.",
    "hint": "Focus on the fetch‑decode‑execute sequence and how data moves between registers and the ALU.",
    "working": [
      "The control unit coordinates fetching the instruction whose address is in the program counter. In the usual sequential fetch model, the program counter is incremented during fetch.",
      "The control unit decodes the instruction and coordinates moving the values from Reg1 and Reg2 to the ALU.",
      "The ALU adds the values; the result is transferred into Reg3.",
      "The next cycle uses the next instruction address in the program counter, unless control flow changes it."
    ],
    "answer": "The control unit coordinates fetching and decoding the addition instruction and moving operands from Reg1 and Reg2 to the ALU. In the standard sequential model, the program counter advances during fetch, before execution finishes. The ALU adds the operands and the result is stored in Reg3. The next fetch uses the next address in the program counter.",
    "notation": false
  },
  "y10-computing-data-representation/practice-2-Edexcel-core": {
    "question": "Explain compression and its role in data representation. In your answer, describe what lossless compression and lossy compression mean, explain why data compression is used (to save storage space and speed up transmission), and compute the compression ratio for a file that is 4.0 MB uncompressed and becomes 1.0 MB after compression. Show how you calculate the ratio, and list one advantage and one disadvantage of each type.",
    "hint": "Think about how much smaller the file becomes after compression.",
    "working": [
      "Compression reduces the number of bits needed to represent data, saving storage and reducing transmission time or bandwidth.",
      "Lossless methods allow exact reconstruction; lossy methods discard some data permanently.",
      "Original:compressed size is 4.0:1.0 = 4:1. The compressed file is 25% of the original, a 75% reduction."
    ],
    "answer": "Lossless compression preserves all information, so the original can be recovered exactly; this suits program and text files, but size reductions may be smaller. Lossy compression discards information and can produce smaller media files, but quality can decline and the discarded data cannot be recovered exactly. Compression saves space and can shorten transmission. The original-to-compressed ratio is 4:1; the compressed file is 25% of its original size, saving 75%.",
    "notation": false
  },
  "y10-computing-data-representation/practice-7-Edexcel-core": {
    "question": "Question 8 – Calculate file sizes (Data Representation) A plain text file uses ASCII encoding, so each character is stored as 1 byte. The file contains 3,450 characters. (a) What is the size of the file in kibibytes (KiB), using 1 KiB = 1024 bytes? (b) If the same file is stored on a disk in blocks of 512 bytes, how many blocks are required to store the whole file? Give your answers for both parts. Give part (a) to two decimal places.",
    "hint": "Think about how many bytes are in the file and how many bytes fit in one kilobyte or one block.",
    "working": [
      "3,450 characters at one byte each require 3,450 bytes.",
      "3,450/1,024 = 3.369140625 KiB, approximately 3.37 KiB.",
      "3,450/512 = 6.73828125, so seven whole blocks are required.",
      "Allocated space is 7 × 512 = 3,584 bytes = 3.5 KiB; 134 bytes of allocated space are unused."
    ],
    "answer": "(a) 3.37 KiB of file data. (b) Seven blocks, allocating 3,584 bytes (3.5 KiB).",
    "notation": false
  },
  "y10-computing-networks-protocols-and-security/practice-1-Edexcel-core": {
    "question": "Explain how protocols and layers work together to send data from a device on a local network to a web server on the internet. In your answer, identify the application, transport, internet and link layers of the four-layer TCP/IP model, name one protocol associated with each layer, and describe the process of encapsulation as the data moves down the layers and decapsulation as it moves back up at the destination.",
    "hint": "Think about how each layer adds a header to the data and how those headers are removed at the far end.",
    "working": [
      "The application layer prepares data, such as an HTTP web request.",
      "TCP at the transport layer adds a header including ports to form a segment.",
      "IP at the internet layer adds addressing information to form a packet for routing.",
      "A link protocol such as Ethernet carries the packet in a frame on the local link.",
      "At the destination, the layers process and remove their encapsulation so the application receives the data."
    ],
    "answer": "In the four-layer TCP/IP model, HTTP is an application protocol, TCP handles transport, IP handles internet addressing/routing, and Ethernet is a link-layer example. Each lower layer encapsulates data from the layer above. At the destination the reverse processing delivers the web request to the application.",
    "notation": false
  },
  "y10-computing-networks-protocols-and-security/practice-9-Edexcel-core": {
    "question": "Compare the advantages and disadvantages of star, bus and mesh network topologies for a small Year 10 ICT suite. A school wants to connect 5 devices (4 PCs and 1 printer) in a room. In a star topology the 5 devices are connected to a switch with cables of 2.0 m each; the switch is at the centre of the room. In a bus topology there is a single backbone cable 6.0 m long, with 5 short drop cables of 0.8 m to each device. In a full mesh topology, every device is connected directly to every other device; assume an average cable length of 1.5 m per connection, allowing for its route; this does not mean all devices are equally distant. Discuss the main pros and cons in terms of reliability, cost, and ease of expansion. Which topology would you recommend for the school with 5 devices and why? Include a simple calculation of total cable length for each topology.",
    "hint": "Think about the number of cables required in each topology to connect all devices.",
    "working": [
      "Star topology total cable length = 5 × 2.0 m = 10.0 m",
      "Bus topology total cable length = 6.0 m backbone + (5 × 0.8 m) = 6.0 + 4.0 = 10.0 m",
      "Mesh topology total cable length = number of connections for 5 devices = 5 × 4 / 2 = 10; total length = 10 × 1.5 m = 15.0 m",
      "Star advantages/disadvantages: easy to add devices; fault on one link affects only that device; if the switch fails, the whole network is down; generally good reliability and scalability, moderate cost",
      "Bus advantages/disadvantages: cheap initial setup; single backbone means a fault can take down the network; adding devices can be disruptive; limited expansion and performance issues with more devices",
      "Mesh advantages/disadvantages: very reliable due to multiple paths; high redundancy; very high cost and complexity with many cables; best for critical networks but impractical for a small five-device room"
    ],
    "answer": "For this five-device setup, I would recommend a star topology. It gives a good balance of cost and ease of expansion: you can add devices by running an extra short cable to the central switch, keeping maintenance straightforward. If a single device’s cable fails, only that device is disconnected, not the whole network. However, you should be aware that if the central switch fails, the entire network stops, which is a clear downside. A bus can have low hardware costs but becomes impractical as more devices are added and performance can degrade with traffic; mesh offers the highest reliability but would be very expensive and complex for only five devices. The stated cable totals are star: 5 × 2.0 = 10 m; bus: 6.0 + 5 × 0.8 = 10 m; full mesh: ten links averaging 1.5 m, totalling 15 m. Cable length alone cannot establish total installed cost.",
    "notation": false
  },
  "y10-computing-programming-techniques/exam-2-Edexcel-core": {
    "question": "Question 3: Create a reusable subprogram (function) named findDiscount that takes two parameters, price and rate. The subprogram should calculate and return the price after applying the discount represented by rate (for example, rate = 0.15 means 15% off). The subprogram must only use its parameters (no global variables) to ensure it can be reused in different programs. Show a short example of how you would call the subprogram with price 120.00 and rate 0.15, and state the value it would return.",
    "marks": 4,
    "markScheme": [
      "Defines a subprogram named findDiscount with two parameters: price and rate.",
      "Calculates the discounted price as price * (1 - rate) and returns this value.",
      "Uses only the provided parameters (no global variables) so the subprogram is reusable.",
      "Includes an example call such as finalPrice = findDiscount(120.00, 0.15) with the result 102.00."
    ],
    "answer": "One valid pseudocode solution:\n\n```text\nFUNCTION findDiscount(price, rate)\n    RETURN price * (1 - rate)\nENDFUNCTION\n\nfinalPrice = findDiscount(120.00, 0.15)\n```\n\nThe call returns 102.00: 120 × 0.85 = 102. The function uses its parameters and no global variables.",
    "notation": false
  },
  "y10-computing-programming-techniques/exam-4-AQA-core": {
    "question": "Write a Python subprogram (function) named totalCost that takes two parameters: quantity (an integer) and price (a real number). The function should return the total cost, calculated as quantity multiplied by price. Then provide the code to call totalCost with quantity = 7 and price = 4.50, assign the returned value to a variable named total, and print total.",
    "marks": 4,
    "markScheme": [
      "A function named totalCost with two parameters (quantity, price) is defined.",
      "The function returns quantity * price.",
      "The function is called with 7 and 4.50 and the result stored in total.",
      "The program prints the value of total."
    ],
    "answer": "```python\ndef totalCost(quantity, price):\n    return quantity * price\n\ntotal = totalCost(7, 4.50)\nprint(total)\n```\nOutput: 31.5.",
    "notation": false
  },
  "y10-computing-programming-techniques/exam-9-Edexcel-core": {
    "question": "A club stores the following Python list of dictionaries:\n```python\nmembers = [\n    {\"name\": \"Liam Brown\", \"age\": 16, \"id\": \"M01\"},\n    {\"name\": \"Sophie Lee\", \"age\": 15, \"id\": \"M02\"},\n    {\"name\": \"Noah Patel\", \"age\": 17, \"id\": \"M03\"},\n    {\"name\": \"Emily Chen\", \"age\": 14, \"id\": \"M04\"}\n]\n```\nWrite Python code using a simple for loop and a single print statement to output the IDs of members aged 16 or older, in array order, on one line separated by single spaces with no trailing space.",
    "marks": 4,
    "markScheme": [
      "Correctly iterates through the array 'members' using a for loop.",
      "Correctly checks that the 'age' field is at least 16.",
      "Correctly accesses the 'id' field of qualifying records and maintains the original order.",
      "Correctly outputs the IDs on one line, separated by a single space, with no trailing space."
    ],
    "answer": "```python\nids = []\nfor member in members:\n    if member[\"age\"] >= 16:\n        ids.append(member[\"id\"])\nprint(\" \".join(ids))\n```\nOutput: M01 M03.",
    "notation": false
  },
  "y10-computing-programming-techniques/practice-2-Edexcel-core": {
    "question": "You are creating a small program for a school tuck shop and want to use a reusable subprogram to calculate totals. Write a reusable subprogram named totalCost that takes two parameters: price (the cost of a single item in pounds) and qty (the number of items). The subprogram should return the final total price including a hypothetical 5% tax, calculated as 5% of the pre-tax total. Then show how you would call this subprogram to find the total cost for 3 items priced at £2.50 each. This is a programming exercise, not a statement of actual tax rates. Use Python for your example.",
    "hint": "Apply 5% VAT to the total before tax and round the final amount to two decimal places.",
    "working": [
      "Base total before VAT = price × qty = 2.50 × 3 = 7.50 pounds",
      "VAT amount = 0.05 × base total = 0.05 × 7.50 = 0.375 pounds",
      "Final total = base total + VAT = 7.50 + 0.375 = 7.875 pounds",
      "Rounded to 2 dp = 7.88 pounds"
    ],
    "answer": "```python\ndef totalCost(price, qty):\n    return round(price * qty * 1.05, 2)\n\nprint(f\"{totalCost(2.50, 3):.2f}\")\n```\nThe unrounded total is £7.875; this example displays £7.88.",
    "notation": false
  },
  "y10-computing-testing-and-defensive-design/exam-7-AQA-core": {
    "question": "A school library system has an online login form that collects a username and a password. For this exercise, the form rules are: - Username must be 5-12 characters long and may contain only lowercase letters a-z and digits 0-9. - Password must be at least 8 characters long and must include at least one uppercase letter, one lowercase letter, and one digit. The system will lock the account after 3 failed login attempts. (a) Identify three validation checks that should be performed on the username and password and explain why each is needed. (b) Describe one measure for protecting stored passwords used in authentication. (c) If a user enters an invalid username, the system should display an error message that does not reveal whether the username exists to protect against user enumeration. Give an example of an appropriate message.",
    "marks": 5,
    "markScheme": [
      "Validate username length 5–12 characters and explain why this helps consistency and storage.",
      "Validate username characters are only lowercase a–z and digits 0–9 to enforce the allowed set and avoid unexpected input.",
      "Validate password length and complexity (at least 8 characters; at least one uppercase, one lowercase, and one digit) to improve security.",
      "Store passwords using salted hashing to protect them in storage.",
      "Use a non-revealing error message to prevent user enumeration (e.g., do not indicate whether the username exists)."
    ],
    "answer": "(a) Three checks: username length is 5–12 characters, to meet the form’s size rule; username characters are only lowercase a–z and digits 0–9, to enforce the allowed set; password length and character checks enforce the stated minimum eight characters with uppercase, lowercase and a digit. Passing validation does not authenticate the user or guarantee a strong password.\n\n(b) Store passwords using a suitable salted password-hashing function, rather than plaintext or reversible storage. A unique salt helps resist precomputed attacks; hashing does not make weak passwords impossible to guess.\n\n(c) For a username format error: “Username must be 5–12 characters and contain only lowercase letters and digits.” This describes the rule without stating whether an account exists. For a failed login, use a generic message such as “Login unsuccessful; check your details.”",
    "notation": false
  },
  "y10-computing-testing-and-defensive-design/exam-8-AQA-core": {
    "question": "A Python function should count scores of 50 or more. Identify its missing punctuation and give a correctly indented version.\n```python\ndef count_passes(scores)\n    passes = 0\n    for score in scores\n        if score >= 50\n            passes += 1\n    return passes\n```",
    "marks": 4,
    "markScheme": [
      "Correctly identifies the missing colon after the function definition line.",
      "Correctly identifies the missing colon after the for loop line.",
      "Correctly identifies the missing colon after the if condition line.",
      "Produces a corrected version of the function that runs and returns the correct count."
    ],
    "answer": "The def, for and if lines each need a colon.\n```python\ndef count_passes(scores):\n    passes = 0\n    for score in scores:\n        if score >= 50:\n            passes += 1\n    return passes\n```",
    "notation": false
  },
  "y10-computing-testing-and-defensive-design/practice-2-AQA-core": {
    "question": "For a positive integer n, this program should sum 1 to n and print the total. Identify the errors and give corrected Python.\n```python\nn = input(\"Enter a number: \")\ntotal = 0\nfor i in range(1, n+1)\n    total = total + i\nprint(\"Total is \" + total)\n```",
    "hint": "Check the data type of the input, ensure the loop line ends with a colon, and avoid joining a string with a number.",
    "working": [
      "n = int(input(\"Enter a number: \"))",
      "for i in range(1, n+1):",
      "print(\"Total is\", total)"
    ],
    "answer": "```python\nn = int(input(\"Enter a number: \"))\ntotal = 0\nfor i in range(1, n + 1):\n    total = total + i\nprint(\"Total is\", total)\n```\nConvert the input to an integer, add the loop colon and print the numeric total without concatenating it directly to a string.",
    "notation": false
  },
  "y10-computing-testing-and-defensive-design/practice-2-Edexcel-core": {
    "question": "This function should add tax to the sum of prices, then apply a 5% discount if the tax-inclusive total exceeds 50. Identify the errors and give corrected Python. Assume tax_rate is a decimal such as 0.20.\n```python\ndef compute_bill(prices, tax_rate):\n    total = 0\n    for price in prices\n        total = total + price\n    total = total + total * tax_rate\n    if total > 50\n        discount = 5\n        total = total - discount\n    return total\n```",
    "hint": "Check the ends of the lines with punctuation and how the discount is calculated.",
    "working": [
      "Step 1: The line \"for price in prices\" is missing a colon at the end; add \":\" to fix the syntax error.",
      "Step 2: The line \"if total > 50\" is missing a colon at the end; add \":\" to fix the syntax error.",
      "Step 3: The discount is a fixed amount (5) rather than a percentage of the total; change to \"discount = 0.05 * total\" to apply a 5% discount."
    ],
    "answer": "Add colons after for and if, and use a percentage rather than a fixed discount.\n```python\ndef compute_bill(prices, tax_rate):\n    total = 0\n    for price in prices:\n        total = total + price\n    total = total + total * tax_rate\n    if total > 50:\n        total = total * 0.95\n    return total\n```",
    "notation": false
  },
  "y10-computing-testing-and-defensive-design/practice-5-AQA-core": {
    "question": "This function should sum the scores and add a 10% bonus when the total is at least 100. Identify and fix three missing colons and the bonus calculation.\n```python\ndef compute_final_score(scores):\n    total = 0\n    for s in scores\n        total += s\n    if total >= 100\n        final = total + 10\n    else\n        final = total\n    return final\n```",
    "hint": "Look for missing colons and check how the bonus is calculated.",
    "working": [
      "The for, if and else lines need colons.",
      "A 10% bonus is total × 0.10, not a fixed 10 points.",
      "Keep the sum inside the loop, but apply the bonus after all scores have been added."
    ],
    "answer": "```python\ndef compute_final_score(scores):\n    total = 0\n    for s in scores:\n        total += s\n    if total >= 100:\n        final = total * 1.10\n    else:\n        final = total\n    return final\n```",
    "notation": false
  },
  "y10-computing-testing-and-defensive-design/practice-5-Edexcel-core": {
    "question": "This Python function should read an integer, square it and print the result. Identify three errors and give corrected code.\n```python\ndef square():\n    n = int(input(\"Enter a number: \")\n    result = n  2\n    print(\"The square is \" + result)\n```",
    "hint": "Check the closing parentheses, the operator for squaring, and the types used in the print statement.",
    "working": [
      "Close the int call with a second parenthesis.",
      "Use n ** 2 to square the number.",
      "Pass text and result as separate print arguments, or convert the result to a string."
    ],
    "answer": "```python\ndef square():\n    n = int(input(\"Enter a number: \"))\n    result = n ** 2\n    print(\"The square is\", result)\n\nsquare()\n```",
    "notation": false
  },
  "y10-design-technology-energy-systems-and-mechanisms/exam-2-AQA-core": {
    "question": "A school compares three energy options. For this simplified calculation, all figures are annual and ignore maintenance and standing charges. Option A uses a gas boiler: running cost £20,600 and operational emissions 31,460 kg CO2. Option B uses a heat pump: running cost £24,400 and operational emissions about 20,304 kg CO2. The heat pump supplies 95,000 kWh of useful heat with a coefficient of performance (COP) of 3.5; COP means useful heat output divided by electricity input. Other electricity use is 60,000 kWh. Option C adds solar panels to Option B. All 9,000 kWh of solar electricity is assumed to be used on site, replacing grid electricity. Grid electricity costs £0.28/kWh and emits 0.233 kg CO2/kWh; count solar electricity as zero operational emissions in this model. Calculate the heat pump electricity input, then Option C’s grid electricity, running cost and operational emissions. Round energy, money and emissions to whole units after calculating. Explain the trade-off between A and C. The solar panels cost £9,000 to install, and the heat-pump installation cost is unknown: explain why a complete first-year cost comparison is not possible.",
    "marks": 6,
    "markScheme": [
      "Heat-pump electricity input = 95,000 ÷ 3.5 ≈ 27,143 kWh.",
      "Option C grid electricity = 95,000 ÷ 3.5 + 60,000 − 9,000 ≈ 78,143 kWh.",
      "Option C running cost ≈ £21,880, using unrounded grid electricity × £0.28.",
      "Option C operational emissions ≈ 18,207 kg CO2, using unrounded grid electricity × 0.233.",
      "Option C has lower operational emissions than A but higher annual running cost; a justified preference depends on the school’s priorities.",
      "The £9,000 solar capital cost is additional to running costs and the heat-pump capital cost is unknown, so the full first-year cost cannot be compared."
    ],
    "answer": "Heat-pump input is 95,000 ÷ 3.5 ≈ 27,143 kWh. Option C buys about 78,143 kWh from the grid, costing £21,880 and producing about 18,207 kg CO2 in this model. It has lower operational emissions than A (31,460 kg) but higher running costs than A (£20,600). There is no single best option without priorities: A has lower running costs, whereas C reduces operational emissions. A complete first-year comparison also needs the £9,000 solar installation cost and the unknown heat-pump installation cost.",
    "notation": false
  },
  "y10-design-technology-energy-systems-and-mechanisms/exam-4-AQA-core": {
    "question": "A small packaging sorter uses a DC motor to rotate a wheel of diameter 60 mm, attached directly to the motor shaft. The circuit is powered by a 9 V battery in series with a SPST switch. The motor runs normally with a current of 0.25 A, and the stall current is 0.80 A. A pusher attached to the wheel rim pushes one item at a time into either of two chutes as the wheel rotates. Explain how the electronic and mechanical parts work together to move and sort the items, and describe the energy transfers and safety considerations.",
    "marks": 5,
    "markScheme": [
      "The SPST switch controls whether current flows from the 9 V battery to the motor, turning the motor on and off.",
      "The DC motor converts electrical energy into rotational mechanical energy; with the wheel directly attached to the motor shaft, the wheel rotates as the motor runs.",
      "The pusher on the wheel rim uses the rotation to engage items and push them into the appropriate chute, transferring rotational energy into the motion of the items.",
      "The supply potential difference is 9 V; at normal operation current is 0.25 A (power = 9 V × 0.25 A = 2.25 W), and if the motor stalls the current rises to 0.80 A (power = 9 V × 0.80 A = 7.2 W), which risks overheating.",
      "Safety and practical considerations: ensure the switch and wiring are rated for the current, include protective devices (e.g., fuse or thermal cut-out), keep fingers and loose clothing away from the rotating wheel, and be prepared to switch off the circuit if the motor overheats or stalls."
    ],
    "answer": "The 9 V battery provides electrical energy to the system. When the SPST switch is closed, current flows from the battery through the switch and into the DC motor, delivering electrical power to the motor. At normal operation the motor draws about 0.25 A, so the electrical power supplied is 9 V × 0.25 A = 2.25 W. If the motor becomes overloaded or cannot turn (it stalls), the current rises to 0.80 A, increasing electrical power to 9 V × 0.80 A = 7.2 W. During normal running the motor transfers energy mechanically through its rotating shaft, while some energy dissipates as heat. At stall the shaft does not rotate, so there is no rotational mechanical power output and the electrical input causes heating. Because the wheel is directly attached to the motor shaft, the wheel rotates as the motor turns. A pusher attached to the rim engages items as the wheel spins, and with each rotation it pushes one item into one of the two chutes. In this way, electrical energy is transformed into rotational energy (mechanical energy), which is further transferred to the items as they are moved by the rotating wheel. In terms of energy transfers, chemical energy stored in the battery becomes electrical energy, which powers the motor to produce rotational kinetic energy. Some energy is inevitably lost as heat due to inefficiencies in the motor and in transmission. The stall current indicates a potential risk of overheating if the motor is prevented from turning for too long or is overloaded. Safety considerations include ensuring the wiring and switch can handle the current (and using a fuse or thermal cut-out to protect against overcurrent), keeping hands and loose clothing away from the rotating wheel, and switching off promptly if the motor overheats or stalls to prevent damage.",
    "notation": false
  },
  "y10-design-technology-energy-systems-and-mechanisms/practice-2-AQA-core": {
    "question": "A 6 W desk lamp runs for 2 hours. Compare three separate scenarios: (a) mains electricity at 28 p per kWh; (b) a 20 Wh battery initially fully charged; (c) an initially empty 20 Wh battery charged by a solar panel delivering a constant 5 W for 3 hours. Assume ideal charging/discharging and no other losses for the calculation. Calculate the lamp energy, mains cost and battery energy remaining in (b) and (c). Evaluate cost and reliability, stating limits of these assumptions.",
    "hint": "Use the energy formula and compare costs and reliability.",
    "working": [
      "Lamp energy = 6 W x 2 h = 12 Wh = 0.012 kWh.",
      "Mains cost = 0.012 kWh x 28 p/kWh = 0.336 p, approximately 0.34 p.",
      "Initially full battery: 20 - 12 = 8 Wh remaining.",
      "Solar charging of the initially empty battery: 5 W x 3 h = 15 Wh stored under the ideal assumptions.",
      "After the lamp runs, the solar-charged battery retains 15 - 12 = 3 Wh."
    ],
    "answer": "The lamp needs 6 x 2 = 12 Wh, or 0.012 kWh. Mains cost is 0.012 x 28 = 0.336 p, about 0.34 p. In (b), the full battery has 20 Wh and retains 8 Wh after use; recharging it still requires an energy source. In (c), the initially empty battery receives 5 x 3 = 15 Wh and retains 3 Wh after use. Its 20 Wh rating is capacity, not additional stored energy.\n\nSolar is sufficient under the stated sunny conditions, but output varies and real charging losses reduce usable energy. Mains is more dependable when available. Sunlight has no fuel cost, but panels and batteries have purchase, maintenance and manufacturing impacts. The data do not establish a universally best environmental choice.",
    "notation": false
  },
  "y10-design-technology-generating-and-developing-ideas/exam-0-AQA-core": {
    "question": "Generate four varied concepts for a compact, spill-proof, easy-to-clean lunch container that can hold a small sandwich plus fruit and could be manufactured for under £3 per unit. Provide each concept with a distinct name and include: a concise description of how it works, the material(s) you would use and why, how the concept meets the brief in terms of size/weight, spill-proofing, cleaning and cost, and a short note on how it could be manufactured. Do not include drawings or diagrams. Each concept must differ in mechanism (e.g., a simple box with a clip lid, a stackable multi-tray design, a fold-out tray with a flexible outer shell, and a modular clip-together system).",
    "marks": 4,
    "markScheme": [
      "Concept 1 is clearly named and described with its mechanism, the materials chosen, and justification of how it meets spill-proofing, ease of cleaning, size and cost.",
      "Concept 2 is clearly named and described with its mechanism, the materials chosen, and justification of how it meets spill-proofing, ease of cleaning, size and cost.",
      "Concept 3 is clearly named and described with its mechanism, the materials chosen, and justification of how it meets spill-proofing, ease of cleaning, size and cost.",
      "Concept 4 is clearly named and described with its mechanism, the materials chosen, and justification of how it meets spill-proofing, ease of cleaning, size and cost."
    ],
    "answer": "Concept 1 — Clip box: a moulded PP body and removable lid with a replaceable silicone gasket and four clips. A smooth cavity supports cleaning; the target outer size is 17 x 11 x 4.5 cm. Check a sandwich and fruit fit in the usable cavity, then test the seal and obtain a cost estimate.\n\nConcept 2 — Stacking trays: two shallow PP trays with separate sealing rims held together by an external strap. Separating the trays aids cleaning and food organisation, but extra seals increase parts and cost. Mould the trays and assemble the strap; test leakage from each tray independently.\n\nConcept 3 — Collapsible bowl: a flexible silicone wall between a rigid base and rim, with a clip lid. It saves space when empty, but folded surfaces may be harder to clean. Mould the flexible body and rigid parts, then test repeated collapse, cleaning and leakage.\n\nConcept 4 — Modular pods: two removable PP pods secured inside a carrier with individual sealed lids. The user can choose a layout, but there are more parts to lose. Mould and assemble the components, checking that the combined usable space holds the meal.\n\nAll four are proposals. Select documented food-contact grades; prototype to verify fit, cleaning and leak resistance. Under £3 per unit is a target requiring quotations at a stated production quantity, not a property guaranteed by a material name.",
    "notation": false
  },
  "y10-design-technology-generating-and-developing-ideas/exam-8-Edexcel-core": {
    "question": "A Year 10 Edexcel Design Technology task. You have designed a cylindrical reusable water bottle with a height of 24.5 cm and a diameter of 7.0 cm. The bottle holds about 600 ml and uses a screw-cap with a silicone seal. After a user-testing session with four peers, the following feedback was given: (i) opening the cap with wet hands is difficult, (ii) the bottle is slippery to hold when wet, (iii) the silicone seal leaks if the cap is not tightened fully. Explain two practical changes you would make in response to this feedback. For one of the changes, give a revised measurement to the nearest 0.5 cm. Outline how you would test each change to show it has addressed the feedback, and what would count as success.",
    "marks": 4,
    "markScheme": [
      "1 mark: proposes a textured cap grip and explains its link to wet-hand opening.",
      "1 mark: proposes a seal/closure improvement addressing incomplete tightening.",
      "1 mark: supplies a relevant revised dimension to the nearest 0.5 cm.",
      "1 mark: gives repeatable opening and leak tests with measurable success criteria."
    ],
    "answer": "First, add a textured grip band 0.5 cm high around the cap. This increases the surface available for gripping without changing the bottle's internal capacity. Test wet-hand opening with five users over repeated trials; a proposed target is at least four opening it unaided within five seconds. This does not by itself establish one-handed usability.\n\nSecond, redesign the sealing seat and add a clear closure indicator so users can tell when the cap is properly seated. Use a replaceable compatible gasket and verify that normal hand tightening makes the intended seal. Test five prototypes with room-temperature water, repeated closure, inversion and a defined shake cycle; require no visible leakage. Include trials where users stop at the indicator rather than tightening excessively. Confirm dimensions, capacity and cost after prototyping.",
    "notation": false
  },
  "y10-design-technology-generating-and-developing-ideas/exam-9-AQA-core": {
    "question": "Question 10 (Generate a range of design ideas) Generate five design ideas for a compact, reusable lunch container suitable for a school pupil. For each idea labelled A–E, provide: MAIN MATERIAL LID TYPE ONE USABILITY FEATURE (that would help with everyday use) EXTERNAL DIMENSIONS (Length × Width × Height) in cm to the nearest 0.5 cm CAPACITY in litres Make sure the dimensions are realistic and internally consistent with the capacity you give. Capacity must be less than the external bounding-box volume because walls, lid and features occupy space. State capacity as a design target to verify by measurement. Do not include diagrams or drawings.",
    "marks": 5,
    "markScheme": [
      "IDEA A includes a defined main material and a suitable lid type for a lunch container.",
      "IDEA B uses a different lid type or material compared with IDEA A to show variety.",
      "IDEA C includes a clear usability feature that improves daily use.",
      "IDEA D provides external dimensions to the nearest 0.5 cm.",
      "IDEA E provides a capacity in litres that is plausible and aligns with its dimensions."
    ],
    "answer": "A: polypropylene body, snap-lock sealed lid, removable divider; external 16.0 × 10.0 × 5.5 cm; target usable capacity 0.70 L. B: food-contact copolyester body, sealed twist lid, carrying loop; 15.0 × 9.5 × 6.0 cm; target 0.65 L. C: stainless-steel body, clipped sealed lid, rounded corners for cleaning; 14.5 × 9.5 × 5.0 cm; target 0.50 L. D: polypropylene body with removable insulating sleeve, snap lid, stackable form; 12.0 × 9.0 × 4.5 cm; target 0.30 L. E: polypropylene body, hinged clip lid with gasket, external cutlery recess; 16.5 × 10.5 × 6.0 cm; target 0.80 L. All capacities are proposed targets below the external bounding volume, not proven internal volumes. Prototype and test actual capacity, leakage, cleaning and food-contact suitability.",
    "notation": false
  },
  "y10-design-technology-generating-and-developing-ideas/exam-9-Edexcel-core": {
    "question": "Question 10: You are designing a compact, leak-proof lunch box for a student to carry in a standard school bag. The external dimensions should be around 17.0 cm long, 12.0 cm wide and 5.0 cm tall. The lunch box should have a capacity of about 660 ml and be easy to open with one hand. It must be made from BPA-free plastic or a similar safe material and have a reliable spill-proof seal. Generate a range of four design ideas (A, B, C and D) that aim to meet these requirements; identify what must be checked before claiming compliance. For each idea, describe the main feature that makes it different, identify the material you would choose, and explain one advantage and one potential drawback of that idea in relation to the brief.",
    "marks": 5,
    "markScheme": [
      "1 mark: distinct rigid clip-box concept with material, advantage and drawback.",
      "1 mark: distinct hinged clamshell concept with material, advantage and drawback.",
      "1 mark: distinct collapsible concept with material, advantage and drawback.",
      "1 mark: distinct modular concept with material, advantage and drawback.",
      "1 mark: recognises usable-capacity, food-contact, one-handed opening and leakage targets require verification."
    ],
    "answer": "A: A PP clip box with a removable divider and replaceable gasket. Its smooth cavity aids cleaning, but clips may be difficult for some users to operate with one hand.\n\nB: A hinged PP clamshell with a single lever latch and divided interior. The attached lid is harder to lose; the hinge and sealing edges need durability tests.\n\nC: A collapsible silicone body with a rigid PP rim and clip lid. It packs smaller when empty, but folds can trap food and make cleaning harder.\n\nD: Two removable PP pods in a carrier, each with its own gasketed lid. They offer flexible packing; additional parts increase cost and the chance of loss.\n\nFor all four, target 660 ml of usable capacity within the 17 x 12 x 5 cm external envelope. External volume is not usable capacity: check the internal model, walls, partitions and lid intrusion. Use documented food-contact grades and verify leakage and one-handed opening with prototypes and representative users.",
    "notation": false
  },
  "y10-design-technology-generating-and-developing-ideas/practice-0-Edexcel-core": {
    "question": "Propose four varied reusable school lunch-container concepts targeting around 650 ml usable capacity. An undivided reference cavity measures 15.0 x 12.5 x 3.5 cm; other concepts may change the cavity dimensions to allow for walls, trays and closures. Aim for leak resistance, recyclable components and a manufacturing cost below £6 at a stated production quantity. Give each concept in two or three sentences and explain what would need verification.",
    "hint": "Think about different forms (rectangular box, multi-compartment, collapsible) and different closures (snap-lock, twist-lock, clamps), plus recyclable materials (PP, HDPE, rPET).",
    "working": [
      "Define usable capacity separately from the external envelope and any internal partitions.",
      "Vary closure or form, while selecting suitable documented material grades.",
      "Treat leak performance, collection for recycling and production cost as targets to verify."
    ],
    "answer": "1. A rigid PP box with two snap latches and a replaceable gasket would have a smooth, easily cleaned cavity. Target about 650 ml after allowing for rounded corners, then verify capacity and leakage on a prototype.\n\n2. Two stackable PP trays could use individual sealed lids and a carrier strap. Each tray would target about 325 ml usable space; the extra bases and lids require a taller overall design than one undivided cavity.\n\n3. A cylindrical HDPE container could use a screw lid with a removable seal. Its different shape offers a distinct grip and closure, but bag fit and opening effort need user testing.\n\n4. A collapsible design could use a flexible wall and rigid PP rim with a clip lid. It saves space when empty, but cleaning folds and separating materials for recycling may be difficult.\n\nUse food-contact documentation for the exact grades, confirm local recycling routes and obtain production quotations before claiming the £6 target is met.",
    "notation": false
  },
  "y10-design-technology-generating-and-developing-ideas/practice-6-AQA-core": {
    "question": "You are designing a compact, reusable lunch container for Year 10 pupils. The design brief requires a leak‑proof container that holds about 350 ml, fits easily in a standard school bag, and can be produced at a low cost. Generate three varied concepts that aim to meet the brief. For each concept, give: external dimensions (length × width × height, or diameter and height for a cylinder) to the nearest 0.5 cm, in centimetres; the material you would use and a brief reason for this choice; the key feature that makes the concept different from the other two; a short justification explaining how this concept meets the brief (capacity, leak‑proofing, bag fit, and production cost).",
    "hint": "Consider different opening mechanisms and sealing methods, and how material choices affect cost and weight.",
    "working": [
      "Vary the form or closure to create three distinct concepts.",
      "Set usable-capacity and outer-size targets separately; space taken by walls and closures reduces capacity.",
      "Verify fit, leakage, cleaning, food-contact suitability and manufacturing cost before final selection."
    ],
    "answer": "A — PP clip box, outer target 12.0 x 7.5 x 4.5 cm, with a removable gasket. Its rectangular form packs compactly; target 350 ml usable capacity after modelling walls, corners and lid intrusion.\n\nB — Cylindrical container, outer target 7.0 cm diameter x 12.0 cm high, with a screw cap and replaceable seal. A documented food-contact copolyester grade could give visibility; target 350 ml internally and test grip and bag fit. Diameter and height fully specify its outer cylindrical envelope.\n\nC — Shallow PP hinged box, outer target 16.0 x 8.0 x 3.5 cm, with a single latch. Its attached lid is harder to lose; model the hinge and seal so that usable capacity remains around 350 ml.\n\nThese are design proposals. Verify actual capacity, leak resistance, user access and cost through CAD, prototypes, material documentation and quotations.",
    "notation": false
  },
  "y10-design-technology-generating-and-developing-ideas/practice-8-AQA-core": {
    "question": "You have designed a reusable lunch box with external dimensions length 15 cm, width 9 cm, height 4.5 cm and a snap-fit lid. After testing with eight students, you receive feedback: (i) the lid is hard to lift, (ii) the box is tall enough that it occasionally sticks in a school bag, and (iii) users want a tighter lid seal to prevent leaks. Respond to these comments by proposing three design changes (one for each point) and explain why each change will improve the product. For any changes that affect size, state the new dimension to the nearest 0.5 cm and calculate the new external envelope volume. Explain why usable capacity cannot be obtained exactly without internal dimensions. You may describe additional design features that do not change size (e.g., grip, gasket).",
    "hint": "Focus on turning each piece of feedback into a concrete design change and use simple volume calculations to compare capacity.",
    "working": [
      "Add an accessible lifting tab to the lid and test opening effort.",
      "Reduce outer height from 4.5 to 4.0 cm while keeping length 15 cm and width 9 cm.",
      "The new external envelope is 15 x 9 x 4 = 540 cm³; internal usable capacity is smaller.",
      "Add a compatible replaceable gasket and check closure and leakage."
    ],
    "answer": "Add a lifting tab or grip feature so users can release the lid more easily. Reduce the outer height to 4.0 cm, retaining the 15 x 9 cm footprint; this directly addresses the reported height problem, although bag-fit testing is still required. The external envelope is 540 cm³, not a verified 540 ml capacity: walls, corners and the lid reduce usable space. Finally, add or improve a replaceable gasket and test leakage after repeated opening. Check all three changes with users and prototypes rather than assuming they succeed.",
    "notation": false
  },
  "y10-design-technology-generating-and-developing-ideas/practice-9-AQA-core": {
    "question": "Generate three alternative concepts, A, B and C, for a reusable school lunch kit. Each kit has three modules of lengths 8.0 cm, 7.5 cm and 9.0 cm placed end-to-end, with maximum total length 25.0 cm. Estimated material costs per kit are A £3.20, B £4.80 and C £2.10, all with a £5 material budget. For each concept propose materials for the outer shell and inner container, explain how it differs, and give two advantages and two drawbacks. Check the shared length and each cost, then choose a concept and justify it. These estimates exclude labour and tooling.",
    "hint": "Think about how each concept could vary in materials, insulation, and cleaning requirements to meet the brief.",
    "working": [
      "All three concepts use a total length of 8.0 + 7.5 + 9.0 = 24.5 cm, below 25.0 cm.",
      "All three stated material costs are below £5, but they are not total production costs.",
      "Vary materials and construction; compare cleaning, mass, durability, insulation and end-of-life separation.",
      "Choose based on the brief and identify tests needed before claiming performance."
    ],
    "answer": "A: recycled-polypropylene outer shell with removable food-contact polypropylene tubs. Advantages: low mass and easy separation for washing. Drawbacks: limited insulation without an extra layer and clips may wear. B: recycled-polypropylene shell with removable stainless-steel inner tubs and insulation between them. Advantages: durable inner containers and potential improved temperature retention. Drawbacks: greater mass and more parts/materials to separate. C: simple polypropylene carrier with removable food-contact polypropylene tubs. Advantages: lowest estimated material cost and simple construction. Drawbacks: little insulation and scratches may develop with use. Each kit is 24.5 cm long; A £3.20, B £4.80 and C £2.10 meet the stated material budget. I would develop A for low mass and easy cleaning, then test loaded fit, clip durability, leakage and washing. Confirm recycled-material sourcing and food-contact suitability; compare total costs and lifecycle impacts before claiming it is the most sustainable option.",
    "notation": false
  },
  "y10-design-technology-generating-and-developing-ideas/practice-9-Edexcel-core": {
    "question": "Generate four different design concepts for a 500 ml insulated water bottle intended for use by Year 10 pupils. The bottle must be leak-proof and keep drinks cool for at least 6 hours in typical school conditions. Each concept should differ in material, outer shape and lid design. For each concept, specify the material(s) used for the bottle walls and insulation, the external dimensions (height and diameter) to the nearest 0.5 cm, the lid design, and a brief justification of why the concept would be suitable for school use. Treat the dimensions and performance as proposed design targets; explain the tests needed before claiming compliance.",
    "hint": "Think about how different materials affect weight, cost and thermal performance, and how lid designs influence leakage resistance.",
    "working": [
      "Step 1: Identify the key requirements from the brief: 500 ml capacity, insulation for at least 6 hours, leak-proof, suitable for Year 10 use.",
      "Step 2: Plan to generate four concepts that vary in material, shape and lid to provide variety.",
      "Step 3: Choose dimension sets that are plausible for 500 ml bottles and round to the nearest 0.5 cm: Concept A height 18.5 cm; diameter 7.5 cm; Concept B height 19.0 cm; diameter 6.5 cm; Concept C height 16.5 cm; diameter 7.0 cm; Concept D height 20.0 cm; diameter 7.0 cm.",
      "Step 4: Assign lid types for each concept to ensure leak resistance: Concept A screw-on cap with silicone seal; Concept B push‑button flip cap; Concept C screw-on cap with gasket; Concept D screw-on cap with O‑ring.",
      "Step 5: Outline how each concept’s insulation approach supports the 6-hour cooling target: Concept A vacuum double-wall; Concept B foam insulation sleeve; Concept C neoprene sleeve around silicone bottle; Concept D vacuum double-wall with durable outer coating.",
      "Step 6: Use these details to write four complete, standalone concept descriptions for the final answer."
    ],
    "answer": "Concept A: Stainless steel vacuum-insulated bottle (capacity 500 ml). Material: walls of 304 stainless steel with an inner stainless liner; insulation: vacuum between the inner and outer walls. External dimensions: height 18.5 cm, diameter 7.5 cm. Lid design: screw-on cap with silicone seal. Why suitable: robust and easy to clean; aims to keep drinks cold for at least 6 hours, subject to testing; ideal for daily school use. Concept B: Plastic bottle with foam-insulated sleeve (capacity 500 ml). Material: inner bottle made from BPA-free Tritan; outer shell of polycarbonate with a foam insulation sleeve between them. External dimensions: height 19.0 cm, diameter 6.5 cm. Lid design: flip-cap with a small push-button opening and a seal. Why suitable: lightweight and affordable; comfortable to carry in bags; would need testing to establish whether the sleeve achieves the 6-hour target. Concept C: Collapsible silicone bottle with neoprene sleeve (capacity 500 ml). Material: collapsible silicone body with a rigid base; outer neoprene insulation sleeve. External dimensions: height 16.5 cm, diameter 7.0 cm. Lid design: screw-on cap with a gasket. Why suitable: compact when not in use; flexible to squeeze; good for school storage, but the neoprene sleeve may not meet the cooling target and must be tested. Concept D: Aluminium bottle with vacuum insulation and powder-coated finish (capacity 500 ml). Material: aluminium body with a stainless steel inner liner; insulation: vacuum double-wall; outer finish powder-coated. External dimensions: height 20.0 cm, diameter 7.0 cm. Lid design: screw-on cap with an integrated gasket for leak‑proofing. Why suitable: durable and lightweight; strong for lockers and sports; aims to maintain cool drinks through a school day, subject to testing. All four are concepts: check usable 500 ml capacity after allowing for walls, insulation and lid; test leakage and temperature change over six hours under the same defined conditions.",
    "notation": false
  },
  "y10-design-technology-investigation-and-design-brief/exam-8-Edexcel-core": {
    "question": "You are designing a reusable school lunch box for Year 10 students. The lunch box should fit into a standard school bag, hold a sandwich and a small fruit pot, and be easy to clean. Write four measurable specifications that could be used to judge whether the finished product meets the design brief. Each specification must include a numerical value with units (where appropriate) and a clear tolerance where it applies. You may include dimensions (length, width, height), capacity, weight, and a timed cleaning test. Do not refer to any diagram.",
    "marks": 4,
    "markScheme": [
      "Specify nominal external dimensions and tolerances, distinguishing them from maximum permitted size.",
      "Specify a minimum internal capacity with units.",
      "Specify a maximum empty mass with units.",
      "Specify a measurable cleaning test with a time and clear pass criterion."
    ],
    "answer": "Proposed targets to validate with users: (1) external dimensions 23.0 × 15.0 × 6.0 cm, each ±0.5 cm; the bag-fit test must therefore accommodate up to 23.5 × 15.5 × 6.5 cm. (2) Internal usable capacity at least 900 cm³, checked by a suitable volume test. (3) Empty mass no more than 350 g. (4) Under a defined test using the same food residue and cleaning method, remove visible residue from all internal surfaces within two minutes. Confirm actual sandwich, fruit-pot and bag fit as part of testing.",
    "notation": false
  },
  "y10-design-technology-investigation-and-design-brief/exam-9-AQA-core": {
    "question": "For the sub-topic Investigate existing products in the same market, compare three fictional insulated travel mugs described below. ThermoCup Mini: Price £12.50; Capacity 350 ml; Weight 280 g; Outer: stainless steel; Inner: BPA-free plastic; Insulation: double-wall; Key features: spill-proof lid, non-slip silicone base. EcoSip 500: Price £18.99; Capacity 500 ml; Weight 420 g; Outer: stainless steel with powder-coated finish; Insulation: triple-wall foam; Key features: leak-proof lid, wide mouth for cleaning, integrated carry handle. QuickTemp Travel Mug: Price £9.75; Capacity 420 ml; Weight 260 g; Outer: plastic body with stainless steel liner; Insulation: double-wall; Key features: seal-tight lid. Your design brief is to create an affordable insulated travel mug for students who travel to school daily. For each mug, state one strength and one weakness based on the data above.",
    "marks": 6,
    "markScheme": [
      "ThermoCup strength: its non-slip base helps stability.",
      "ThermoCup weakness: smallest capacity, 350 ml.",
      "EcoSip strength: largest capacity, 500 ml, or wide mouth aids cleaning.",
      "EcoSip weakness: highest price, £18.99, or greatest mass, 420 g.",
      "QuickTemp strength: lowest price, £9.75, or lowest mass, 260 g.",
      "QuickTemp weakness: smaller capacity than EcoSip, 420 ml versus 500 ml."
    ],
    "answer": "ThermoCup has a non-slip base but the smallest capacity (350 ml). EcoSip has the largest capacity (500 ml) and a wide mouth for cleaning, but costs the most (£18.99) and is heaviest (420 g). QuickTemp is cheapest (£9.75) and lightest (260 g), but has less capacity than EcoSip. Temperature retention cannot be ranked confidently without comparable test results.",
    "notation": false
  },
  "y10-design-technology-materials-and-their-properties/practice-7-AQA-core": {
    "question": "You are designing a transparent, rigid lid for a reusable lunchbox. The lid must be food-safe, withstand daily washing in a domestic dishwasher, remain clear after repeated use, and resist being dropped without breaking. Make a provisional material choice, linking relevant material properties to the uses, and explain what grade-specific evidence would be needed before final selection. Include a brief comparison with two alternative materials and explain why they are less suitable.",
    "hint": "Think about how the lid must stay clear, not crack if dropped, and cope with dishwasher heat or detergents.",
    "working": [
      "Identify optical clarity, impact resistance, rigidity, food-contact suitability and resistance to the intended cleaning conditions.",
      "Compare candidate grades using supplier evidence and testing, rather than assuming all grades of one polymer have the same suitability.",
      "Acrylic is clear but generally more brittle; standard PETG grades may have lower heat resistance. Neither comparison removes the need to check the exact grade."
    ],
    "answer": "My provisional choice is a suitable grade of polycarbonate because of its clarity and impact resistance, but its name alone does not establish food-contact or dishwasher suitability: the exact grade and finished product need suitable supplier documentation and testing for the intended use. Acrylic is clear but generally more brittle when dropped. Standard PETG is clear and tough but may deform at dishwasher temperatures. I would compare verified grades, then test clarity, fit and impact performance after repeated specified cleaning cycles before selecting the material.",
    "notation": false
  },
  "y10-design-technology-materials-and-their-properties/practice-9-Edexcel-core": {
    "question": "Classify material families Classify each of the following five material descriptions into one of the material families: metals, polymers, ceramics, composites, or natural materials. Write the family name for each item (a–e). a) Conducts electricity and is malleable, and can be drawn into wires. b) A hard, stiff, brittle material with a very high melting point and poor electrical conductor. c) A thermoplastic that softens when heated and can be moulded, then hardens when cooled. d) A material made by combining two or more different materials to improve strength and stiffness. e) A material that comes from a living source, is flexible, and can decompose naturally.",
    "hint": "Think about the characteristic properties of each material family.",
    "working": [
      "Note the key property in each description to match with a family (electrical conductance and malleability point to metals).",
      "Thermoplastics are polymers; not all polymers soften on reheating. Ceramics are generally hard and brittle; composites combine materials; natural materials here are obtained from living sources.",
      "Assign each description to the closest material family based on those properties."
    ],
    "answer": "a metals b ceramics c polymers d composites e natural materials",
    "notation": false
  },
  "y10-design-technology-people-society-and-environment/exam-0-Edexcel-core": {
    "question": "Apply life-cycle thinking to decide between two reusable lunch box designs for a school canteen. Design A is made from 100% polypropylene (PP); Design B uses a bamboo composite with a PP liner. The following life-cycle data apply for a three-year use period in a school setting. Design A Production emissions: 0.65 kg CO2e Use-phase emissions (three years): 0.15 kg CO2e End-of-life emissions: 0.15 kg CO2e Design B Production emissions: 0.54 kg CO2e Use-phase emissions (three years): 0.12 kg CO2e End-of-life emissions: 0.08 kg CO2e Calculate the total life-cycle CO2e emissions per lunch box for each design, and state which design has the lower stated greenhouse-gas impact over three years. Justify your answer briefly by referring to the data given. State one limitation of judging overall environmental impact from these figures alone.",
    "marks": 6,
    "markScheme": [
      "Adds A’s three stages: 0.65 + 0.15 + 0.15.",
      "Obtains A total 0.95 kg CO2e.",
      "Adds B’s three stages: 0.54 + 0.12 + 0.08.",
      "Obtains B total 0.74 kg CO2e.",
      "Selects B as lower by 0.21 kg CO2e under the supplied model.",
      "Notes another impact or assumption, such as water use, durability, recyclability or achieving three years of use."
    ],
    "answer": "A totals 0.95 kg CO2e and B totals 0.74 kg CO2e over the stated three years. B is lower by 0.21 kg CO2e, so it is preferable for the greenhouse-gas measure in this dataset. This does not establish lower overall environmental impact: water use, durability, material sourcing and end-of-life separation also matter.",
    "notation": false
  },
  "y10-design-technology-people-society-and-environment/exam-1-Edexcel-core": {
    "question": "Question 2 — A school is designing a 700 ml reusable water bottle intended to be easy for all pupils to use, including those with limited hand strength or dexterity, left- or right-handed users, and those with visual impairments. The bottle features a silicone grip around the body, a wide-cap lid designed for one-handed opening, and high-contrast measurement marks every 100 ml on a white body. Explain two inclusive design features of this bottle and explain how each feature supports users with different needs. Then propose one further improvement to enhance inclusivity and justify why it would help.",
    "marks": 6,
    "markScheme": [
      "1 mark: identifies the silicone body grip.",
      "1 mark: links it to reduced slipping or easier holding for users with reduced grip strength.",
      "1 mark: identifies the wide-cap opening feature.",
      "1 mark: explains its intended benefit while recognising user testing is needed.",
      "1 mark: proposes a further relevant feature, such as tactile measurement marks.",
      "1 mark: explains how the proposal benefits a stated user need."
    ],
    "answer": "The silicone body grip can reduce slipping and make the bottle easier to hold for some users with reduced grip strength. The wide-cap feature aims to make opening easier, but one-handed use and suitable opening effort must be tested with both left- and right-handed users and people with different hand function. As a further improvement, add raised tactile measurement marks alongside the printed high-contrast marks. These could help users who cannot read the printed scale; their spacing and clarity should be tested with the intended users.",
    "notation": false
  },
  "y10-design-technology-people-society-and-environment/practice-1-AQA-core": {
    "question": "A school supplier is redesigning a cylindrical water bottle to be inclusive for pupils. The bottle has a body diameter of 7.0 cm and a height of 18.0 cm. The cap diameter is 3.5 cm and includes a 2.0 cm grip loop. Two inclusive design features are being considered: (a) a textured rubber sleeve around the body to improve grip for users with limited hand strength, and (b) a cap with a wide, soft top surface and a shallow recess around the edge so the cap can be opened easily with either hand. For each feature, explain why it would help a specific user group (name the user group and the benefit). The revised cap makes the total bottle height 18.5 cm. Does this satisfy a lunchbox’s internal height limit of 22 cm? Explain what else you need to check for full fit. Show your reasoning.",
    "hint": "Think about how grip and reach differ for users when you name the user groups and justify the benefits.",
    "working": [
      "A textured sleeve may help a user with reduced grip hold the bottle with less slipping; test this with intended users.",
      "A wider cap surface may help people using either hand apply force, but easy opening still depends on the mechanism and required torque.",
      "18.5 cm is below the 22 cm internal height limit, leaving 3.5 cm vertical clearance.",
      "Check internal width, depth and access through the opening before claiming the whole bottle fits."
    ],
    "answer": "The textured sleeve is intended to help users with reduced grip, while a wide cap contact area may help pupils who need to open it using their non-dominant hand. Neither benefit is guaranteed without user testing. The revised 18.5 cm height meets the 22 cm internal height limit, with 3.5 cm clearance. Full fit also depends on the lunchbox’s internal width, depth and opening size.",
    "notation": false
  },
  "y10-design-technology-people-society-and-environment/practice-2-AQA-core": {
    "question": "Evaluate responsible innovation for a planned modular smartphone designed to be repairable and upgradeable. The device weighs 180 g, has a 6.2-inch screen, a 4000 mAh battery, and an aluminium frame that weighs 40 g, with 60% of the aluminium recycled. The design allows the battery and back cover to be replaced. Packaging uses 20 g of cardboard from recycled paper and 3 g of plastic film. About 70% of components are sourced from UK/EU suppliers. Manufacturing emissions are stated as 60 000 kg CO2e per 1000 units. The retail price is £399. The product is expected to have a lifespan of 4 years with replacement parts available. An end-of-life take-back scheme recovers 80% of the device by mass. Using these details, evaluate how responsibly this design balances environmental, social and economic considerations. In your answer, discuss at least two trade-offs and propose one improvement.",
    "hint": "Think about the product’s life cycle, the amount of material recovered at end of life, and how material choices and take-back affect people, the planet and costs.",
    "working": [
      "Step 1: 0.60 × 40 g = 24 g recycled aluminium; virgin aluminium = 40 g − 24 g = 16 g.",
      "Step 2: 0.80 × 180 g = 144 g recoverable at end of life.",
      "Step 3: 180 g − 144 g = 36 g not recovered.",
      "Step 4: Packaging mass = 20 g + 3 g = 23 g.",
      "Step 5: Manufacturing emissions per unit = 60 000 kg CO2e per 1000 units ÷ 1000 = 60 kg CO2e per unit.",
      "Repairability can extend useful life but depends on affordable parts, tools and support.",
      "Take-back can improve recovery but requires participation and collection logistics.",
      "Improve disassembly and parts availability, then measure achieved recovery rather than promising 100%."
    ],
    "answer": "The design uses 24 g recycled aluminium in its 40 g frame and claims recovery of 144 g of the 180 g device; the separate 23 g packaging is not part of that recovery calculation. Manufacturing emissions are 60 kg CO2e per device under the stated boundary. Repairable parts could extend use, but parts and repair costs may make the £399 purchase less affordable for some users. Take-back could recover material, but transport, sorting and participation bring costs and determine actual recovery. UK/EU sourcing does not by itself prove low emissions or fair labour conditions. I would improve access to affordable replacement parts and design joints for disassembly, then measure recovery in practice. The four-year life is an expectation to test, not a guarantee, and complete recovery should not be promised.",
    "notation": false
  },
  "y10-design-technology-people-society-and-environment/practice-5-AQA-core": {
    "question": "This is a fictional product proposal; treat the stated performance and privacy descriptions as claims to evaluate. Evaluate the responsible innovation of the HydroGuard Smart Bottle, a 600 ml bottle that weighs 210 g when empty and is made from 60% recycled plastic and 40% virgin plastic. It is charged by USB-C, with a full charge in 2 hours. The bottle connects to a Bluetooth app that records the time and amount of water consumed; data is stored on the user’s phone and anonymised usage data is used only to improve product design, with no data shared with third parties. The packaging is 100% recyclable cardboard. The product is designed for up to 3 years, costs £22, and includes a 2-year warranty. The company claims the product reduces plastic waste by 15% per user per year compared with using disposable bottles, by promoting reuse and regular hydration. Evaluate whether this product demonstrates responsible innovation, considering social, environmental, and ethical aspects. In your answer, identify strengths and weaknesses of the approach and suggest improvements.",
    "hint": "Think about who benefits, who might be left out, and how waste is managed at the end of the bottle’s life.",
    "working": [
      "Step 1: Identify social and environmental benefits from reusing a durable bottle and promoting regular hydration, which could lower the use of disposable plastic.",
      "Step 2: Consider accessibility and affordability concerns, since £22 and the need for a smartphone app may exclude some users.",
      "Step 3: Assess materials and end‑of‑life: 60% recycled plastic reduces virgin material but 40% is virgin; 3‑year design life and recyclable packaging support sustainability, though a take‑back or repair option could improve recovery and reuse.",
      "Step 4: Evaluate data ethics and privacy: app collects personal usage data but claims anonymised data for design; ensure clear consent and privacy protections are in place.",
      "Step 5: Weigh the overall claims (15% annual reduction in plastic waste) and sustainability balance; identify any potential hidden environmental costs (manufacture, charging energy) and practical limitations."
    ],
    "answer": "Reuse and 60% recycled plastic are potential strengths, but the claimed 15% annual waste reduction needs a baseline, a method and evidence of actual use. The three-year design life does not establish recyclability or guarantee durability; the electronics and battery may complicate repair and end-of-life processing. The £22 price and app requirement may also exclude some users. The proposal says usage data is anonymised and not shared with third parties, but the manufacturer would need to explain what leaves the phone, why it is needed and how re-identification is prevented. Clear controls and minimal collection would strengthen the design. I would prioritise replaceable parts, a usable non-digital mode and an evidence-based comparison with an ordinary reusable bottle before endorsing the environmental claim.",
    "notation": false
  },
  "y10-design-technology-people-society-and-environment/practice-5-Edexcel-core": {
    "question": "This is a hypothetical product comparison. Treat recycling rates and performance as assumptions to verify locally. Evaluate the responsible innovation of the Eco-Box lunchbox, designed to replace single-use plastic packaging in schools. The Eco-Box is made from 60% recycled plastic and a 40% bio-based PLA outer shell. It has an estimated lifespan of 3 years with normal use and is dishwasher-safe. The production energy per unit is 12 MJ and the CO2e emitted in production is 0.9 kg per unit. It costs £2.50 to manufacture each unit and is sold to schools for £6.00. End-of-life: 85% of units can be recycled in some local recycling schemes, with 15% ending up as general waste. For a cohort of 100 pupils using one Eco-Box each for 3 years, disposable bags would create 0.02 kg CO2e per bag, with each pupil using 2 bags each school day, 5 days a week, for 36 weeks a year. Using these figures, evaluate whether adopting Eco-Box represents responsible innovation in terms of environmental, social and economic aspects, and state a clear position for whether the school should adopt it.",
    "hint": "Consider both environmental impact and cost/benefit for the school, and compare emissions saved with emissions produced.",
    "working": [
      "100 boxes have stated production emissions of 100 × 0.9 = 90 kg CO2e.",
      "The assumed bag use is 100 × 2 × 5 × 36 × 3 = 108,000 bags, with 2,160 kg CO2e at the stated rate.",
      "The difference between these supplied figures is 2,070 kg CO2e, excluding washing, transport, replacements and end-of-life effects not quantified.",
      "The school pays £600. The supplier receives £600 and incurs £250 stated manufacture cost, leaving £350 before other costs; this is not profit for the school.",
      "Check whether the actual mixed-material product is accepted by a collection scheme, and verify durability and safe intended use."
    ],
    "answer": "I would consider a trial rather than unconditional adoption. Under the supplied assumptions, the difference between bag emissions and box manufacture is 2,070 kg CO2e over three years for 100 pupils. It is not a complete lifecycle saving because washing, transport, replacement and disposal effects are missing. The school must spend £600; the £350 difference between selling price and manufacturing cost belongs to the supplier before other costs, not to the school. Reuse could reduce waste, but affordability, cleaning arrangements and replacement provision affect pupils. The claimed 85% recycling rate must be checked against a scheme accepting this actual mixed-material design; bio-based PLA is not automatically accepted with ordinary plastics. Adoption depends on those checks and sustained reuse.",
    "notation": false
  },
  "y10-design-technology-people-society-and-environment/practice-9-AQA-core": {
    "question": "A single beverage bottle weighs 25 g and is made from PET. The production uses a mix of recycled PET and virgin PET: 60% of the material is recycled PET and 40% is virgin PET. The energy embodied per kilogram of virgin PET is 70 MJ, and the energy to recycle PET is 15 MJ per kilogram. Calculate the total embodied energy, in megajoules (MJ), used to produce one bottle.",
    "hint": "Use a weighted average energy per kilogram based on the recycled/virgin split, then multiply by the bottle's mass.",
    "working": [
      "25 g = 0.025 kg.",
      "Weighted energy = 0.60 × 15 + 0.40 × 70 = 9 + 28 = 37 MJ/kg.",
      "Energy per bottle = 0.025 × 37 = 0.925 MJ under the stated simplified model."
    ],
    "answer": "0.925 MJ per bottle, using the supplied material-energy figures.",
    "notation": false
  },
  "y10-design-technology-processes-and-quality/exam-0-Edexcel-core": {
    "question": "Question 1 (Plan production): A plastics workshop plans to produce 1,000 caps per day using three identical moulding machines. Each cap requires a machine cycle time of 42 seconds. There is a batch setup time of 8 minutes at the start of each batch, and a quality check that lasts 4 minutes after each batch. The production shift is 7 hours 30 minutes long, with a 30‑minute break, so the available working time is 7 hours (420 minutes). Each batch consists of 200 caps. Plan production: determine the minimum number of machines required to meet the daily target within the shift time, and provide a simple production plan (how many batches per machine) that would meet the target. State the time taken by each machine and the total time to finish all batches.",
    "marks": 4,
    "markScheme": [
      "Calculate batch time: 200 caps × 42 seconds per cap = 8,400 seconds = 140.0 minutes; plus 8 minutes setup and 4 minutes QA per batch; total per batch = 152 minutes.",
      "Show that 2 machines are insufficient: with 5 batches, distributing as 3 on one machine and 2 on the other gives the longer machine time of 3 × 152 = 456 minutes, which is longer than the 420 minutes available.",
      "Determine minimum number of machines: 3 machines are required to meet the target within the shift time.",
      "Provide a concrete plan: distribute 5 batches as 2 batches on Machine A, 2 batches on Machine B, and 1 batch on Machine C; times per machine are 2 × 152 = 304 minutes for Machines A and B, and 1 × 152 = 152 minutes for Machine C; total completion time is 304 minutes (all batches finished within the 420-minute working window)."
    ],
    "answer": "Minimum number of machines: 3. Production plan: 5 batches of 200 caps each; assign 2 batches to Machine A, 2 batches to Machine B, and 1 batch to Machine C. Time per batch: 152 minutes. Machine A total time = 304 minutes; Machine B total time = 304 minutes; Machine C total time = 152 minutes. Total time to finish all batches = 304 minutes (5 hours 4 minutes).",
    "notation": false
  },
  "y10-design-technology-processes-and-quality/practice-0-Edexcel-core": {
    "question": "Plan production for 480 wooden key fobs (60 mm long, 25 mm wide, 3 mm thick) that require three operations in sequence: 1) Cutting to size, 2) Drilling two holes, 3) Deburring/finishing. Times per unit are: cutting 0.9 minutes, drilling two holes 0.5 minutes, finishing 0.3 minutes. The workshop has one cutting machine, one drilling machine and one finishing station. Assume one operator works on one batch stage at a time, with no overlapping operations. Ignore transfer and setup time for the calculation. The production week is 5 days, 7 hours per day. Maintenance downtime takes 10% of the available time. Outline a production plan (including the order of processes and batching) to meet the weekly target of 480 units, and then calculate: (a) the total time to produce 480 units, (b) the total available production time per week, (c) whether the current resources are sufficient to meet the target, and (d) if not, how much extra capacity would be required.",
    "hint": "Under the stated single-operator assumption, add all operation times; overlap would require a different calculation.",
    "working": [
      "Time per unit = 0.9 + 0.5 + 0.3 = 1.7 minutes.",
      "Total time for 480 units = 480 × 1.7 = 816 minutes.",
      "Weekly available time before downtime = 7 hours/day × 5 days × 60 = 2100 minutes.",
      "Downtime = 10% of 2100 = 210 minutes; available time = 2100 − 210 = 1890 minutes.",
      "Compare: 816 minutes required vs 1890 minutes available; resources are more than sufficient.",
      "Maximum units possible per week = floor(1890 ÷ 1.7) = floor(1111.76) = 1111 units.",
      "Extra capacity (weekly) = 1111 − 480 = 631 units."
    ],
    "answer": "Use four batches of 120: cut a batch, drill it, then deburr/finish it before proceeding to the next. Check the first piece and sample later pieces at each stage. Under the stated no-overlap assumption, processing time is 480 x (0.9 + 0.5 + 0.3) = 816 minutes. Available weekly time is 5 x 7 x 60 x 0.90 = 1890 minutes. The target fits, with 1074 minutes remaining and no extra capacity required. The idealised maximum under these assumptions is floor(1890/1.7) = 1111 units, or 631 beyond the target; actual setup, inspection and transfer time would reduce it.",
    "notation": false
  },
  "y10-english-century/exam-5-AQA-core": {
    "question": "In Great Expectations, Charles Dickens traces Pip’s development from a humble forge-boy to a self-styled gentleman and back toward a more grounded sense of self. Trace how the theme of identity and self-invention is developed across the whole novel. In your answer, discuss how Pip’s view of himself changes from childhood to adulthood, and how the actions and attitudes of other characters, such as Joe, Magwitch, Estella, and Miss Havisham, influence that change. You should refer to moments across the text to show how the theme is established, challenged, and resolved.",
    "marks": 6,
    "markScheme": [
      "Identifies identity/self-invention as the central theme and notes it is traced across the whole novel.",
      "Cites and links key moments from across the text (childhood with Joe and the forge; Pip’s “great expectations”; Magwitch’s reveal; Estella and Miss Havisham; later shifts) to show development.",
      "Explains how Pip’s use of language and his self-perception change from naive pride as a boy to self-doubt and humility as an adult.",
      "Shows how other characters shape Pip’s identity (Joe’s steady kindness; Magwitch’s revelation and debt; Estella’s snobbery; Miss Havisham’s manipulation).",
      "Discusses how the novel’s structure (early experiences, turning points, and the ending) helps trace the journey of Pip’s identity.",
      "Concludes with a clear judgement that true worth lies in loyalty and kindness rather than wealth or status."
    ],
    "answer": "From the start, Pip’s sense of who he is is bound up with his place in a simple, working-class world. He values Joe’s steady kindness and the close bond of family and community that the forge represents. This early identity is modest and grounded; Pip takes pride in belonging to a small, honest world and in being a debtor to people who care for him. When Pip meets Miss Havisham and Estella, his view of himself begins to shift. He is drawn to the idea of becoming a gentleman because that status promises access to the social circle he associates with Estella. The notion of “great expectations” ignites in him a new self-image: he imagines a future defined by wealth, polish and distance from his humble origins. Dickens makes this change clear through Pip’s thoughts and choices as he embraces money and appearances as signs of worth, even if his feelings for Joe and the forge are mocked or overlooked. The turning point comes with Magwitch’s revelation that he is Pip’s benefactor. This overturns Pip’s assumption that wealth and social success will prove his value. Pip realises that his gentlemanly life has been financed by Magwitch, a transported convict who made money through work and business overseas. The challenge this discovery poses to Pip’s class prejudices unsettles Pip and forces him to re-evaluate what truly matters about who he is. The important insight is not the money itself but the moral debt Pip owes to Magwitch and the need to acknowledge where his “great expectations” came from. Throughout these shifts, other characters pull Pip in different directions. Joe’s ongoing decency stands as a contrast to Pip’s earlier snobbery, reminding him of a gentler standard of worth. Estella and Miss Havisham distort Pip’s self-image by associating value with beauty and wealth, but their influence is destabilising rather than ultimately defining. The tension between Pip’s growing pride and his affection for loyal people sharpens as the narrative moves toward its end. In the final sections, Pip recognises that his true identity is not secured by money or status but by relationships and moral responsibility. He returns to Joe and Biddy with humility and gratitude, and he tries to repair the distance he created between himself and the people who cared for him at the start. Dickens thus shows identity as something negotiated across the whole text: it is shaped by social pressures, personal choices, and the people who remain loyal or reveal the hollowness of pretence. Overall, the theme of identity and self-invention is developed by tracing Pip’s evolving self-perception—from confident but naive aspirations for status, through crisis and moral reckoning, to a more grounded understanding that true worth lies in loyalty, kindness, and honest relationships rather than wealth.",
    "notation": false
  },
  "y10-english-lang-reading/exam-0-Edexcel-core": {
    "question": "Read the following passage. Explain two implicit ideas about the narrator's feelings towards family expectations and belonging, supported by evidence from the text. Use quotation from the passage to illustrate your points. (4 marks) I sat while Aunt Mira pressed a small cake into my hands and said, “Try something sweet, darling, you deserve it after everything you've been through.” The words tasted like sugar and smoke, and I wasn't sure which was heavier. The room smelled of lemon polish and rain, a mix that made the white wallpaper look older than the photographs on the mantel. Grandma's portrait winked down from above the piano, a stern smile that never seemed to notice the bus-stop clatter outside the window. When Uncle Tom asked about college, I explained that I had applied to a course in “creative media” rather than “proper journalism” like the other cousins. “You always chase stories,” he said with a half-smile, “even if they don't belong to you.” My sister, who spent most dinners staring at her phone, looked up and asked what sort of stories I would tell first. I said I wasn't sure yet, and the thought of being watched—by them, by the room, by my own hands—made my shoulders rise, as if to shield a secret I didn't know I had. When the cake finally disappeared, Aunt Mira whispered, “We are proud of you, dear,” and I heard the word “we” as if it included everyone but me.",
    "marks": 4,
    "markScheme": [
      "Identifies pressure about family expectations.",
      "Supports the interpretation through “proper journalism” or the narrator’s rising shoulders, explaining its effect.",
      "Identifies the narrator’s sense of exclusion.",
      "Uses “we” seeming to include “everyone but me” to explain that exclusion."
    ],
    "answer": "The narrator seems anxious about meeting family expectations: contrasting “creative media” with “proper journalism” suggests a hierarchy of acceptable choices. Their shoulders rising “as if to shield a secret” reinforces discomfort under scrutiny. They also feel excluded despite the family’s praise: hearing “we” as if it includes “everyone but me” suggests that others’ shared pride does not produce a corresponding sense of belonging.",
    "notation": false
  },
  "y10-english-lang-reading/exam-4-AQA-core": {
    "question": "Read the extract below and answer the question that follows. Extract: Rain hammered the windows of the old station as Lena waited on the platform. The clock on the wall ticked louder than her breaths. \n\nA man in a faded coat approached, glancing over his shoulder as if the station itself was listening. He handed her a letter, pressed into her gloved hand, and then stepped back, as if afraid of being seen. \n\nThe train arrived with a shout of steam; people moved like fish in a crowded stream. \n\nLena unfolded the letter. The ink smelled faintly of soap and lemon, and the words were simple: 'Go to the river at dawn.' She folded it again, tucked it into her coat, and walked away, but every step made the platform stretch and bend, as though the ground itself was urging her to turn back. Analyse how the writer uses structural features to create tension in this extract. In your answer, refer to the way sentence length, paragraphing and the placement of events contribute to the overall effect on the reader.",
    "marks": 5,
    "markScheme": [
      "Varied sentence length to control pace and build tension.",
      "Paragraph breaks organise the sequence of actions and heighten suspense.",
      "The letter’s placement after initial contact acts as a turning point driving the plot and tension.",
      "Descriptive details (rain, clock, station) establish mood and atmosphere that underpins tension.",
      "Ending image (ground stretching and bending) uses personification to mirror Lena’s fear and imminent decision."
    ],
    "answer": "The opening paragraph focuses on rain and the clock, delaying the arrival of the unknown man and establishing tense waiting. The second paragraph shifts to his approach and the unexplained letter; his glances and withdrawal leave his motives uncertain. The train then interrupts the exchange with movement and noise. In the final paragraph, the short sentence “Lena unfolded the letter” isolates a decisive action before revealing the command. The longer closing sentence follows her movements but ends with an image of the ground urging her back, leaving the decision unresolved.",
    "notation": false
  },
  "y10-english-lang-writing/exam-4-AQA-core": {
    "question": "Write a descriptive piece about an old harbour at dawn. Your piece should use varied sentence forms for effect, be written in the first person, and include vivid sensory details (sight, sound, smell, touch). Aim for about 190 words.",
    "marks": 6,
    "markScheme": [
      "Use varied sentence forms (for example short and extended sentences or a purposeful question) to create rhythm and mood.",
      "Include vivid sensory details (sight, sound, smell, touch) to immerse the reader in the harbour setting.",
      "Maintain a clear first-person voice with a consistent perspective and appropriate tone.",
      "Demonstrate controlled punctuation and sentence openings to regulate pace and emphasis.",
      "Organise the description coherently with logical sequencing and strong paragraphing.",
      "Show accurate spelling, punctuation, and grammar throughout."
    ],
    "answer": "Before the town wakes, the harbour sits like a patient old dog. The water is pale, almost bone-white in the early light, and it licks the quay with a slow, patient rhythm. A gull crashes out of nowhere, its cry tearing the hush, then drops back to the ripples as if nothing happened. The air tastes of salt and tar and something fishy that clings to the tongue.\n\nI press my fingers to the rough timber of the post and feel the grain bite back, hard and honest. The ropes hang in stiff, scarred loops; I count the knots as if they are beads on a prayer.\n\nThe sun climbs a notch above the fog, turning the masts into shadowy lances across the water. A bell tolls faintly in the distance; I answer with a slow exhale and a question I never mean to ask aloud: what stories drift ashore here today? A fisherman wipes his hands on a rag; a cat slips along the edge of the dock, tail flicking, ready to pounce on the first scent of sardine. Dawn arrives, stubborn and bright, and I realise the harbour has been waiting for me to listen.",
    "notation": false
  },
  "y10-english-lang-writing/exam-6-AQA-core": {
    "question": "Write an original story of 520–560 words set in a small coastal town. Your story must use a deliberate shape: tell the action in alternating short sections beginning in the present on the harbour wall, then weave two distinct flashbacks in turn (Flashback A and Flashback B), and finish by tying the strands together in a final paragraph. The central theme is how memory shapes identity. Include dialogue and vivid sensory detail (sea air, sounds, colours). Do not refer to diagrams or any non-text elements. The piece should be written in ordinary Year 10 English style, with correct spelling, punctuation and grammar.",
    "marks": 6,
    "markScheme": [
      "Clear non-linear structure with a present moment on the harbour wall alternating with two distinct flashbacks, concluding in a unified final paragraph.",
      "Explores how memory shapes identity and uses structure to emphasise this theme.",
      "Vivid, sensory descriptive writing of the coastal town and sea settings.",
      "Use of dialogue to reveal character and advance mood or meaning.",
      "Coherent sequence, appropriate paragraphing, and controlled tense usage.",
      "Suitable length (520–560 words) and language appropriate for Year 10; accurate spelling and punctuation."
    ],
    "answer": "The harbour wall glows copper in the late light, and the tide sighs against the stones like a tired old song. I hold a bottle I found half-buried in seaweed, the glass slick with spray. Inside is a folded note in neat handwriting and a small black-and-white photograph, edges curled from salt. I lean over the wall and read aloud to no one but the gulls: “To Ayla, if you find this, remember who you are.” I tuck a strand of damp hair behind my ear and listen to the cork creak as I replace it.\n\nWhen I was six, the harbour was a playground of smells: fish and tar from the boats, chlorine from the laundry hanging on the line, and the sharp bite of sea air that makes my nose tingle. My mam plays a tune on her tin whistle while I press a conch shell to my ear and pretend the sea is talking to me. She crouches to tie my shoelace and says, softly, “If you listen closely, you’ll hear your name in the waves.” The lighthouse behind us blinks like a patient eye, and I swear the sea answers back. She slips a small shell into my hand and whispers, “Keep this safe; it’s a reminder.” I promise I will, though I don’t yet understand what I am keeping.\n\nA rope taps the wall beside me. The sound brings me back to the bottle, then to another memory.\n\nYears later, I stand at the back of a school bus as we roll along the coast road, the town shrinking into a map of grey and green. A classmate scoffs that I’m not “hard enough” for the world, and I bite back with a joke that lands flat. The argument feels like a storm breaking too soon. After, Mam finds me at the kitchen table, the evening glow stretching across the linoleum. She doesn’t yell. She just rests her hand over mine and says, “Memories aren’t cages, Ayla. They’re ships. If you choose the port that fits you, you’ll know you’re still yourself wherever you go.” Her voice passes through the room like a warm current, and I feel the old shell I kept in the drawer beneath the sink, the one she gave me with a smile and a nod.\n\n I unfold the note fully and realisation lands softly, like tidewater in a small bowl. The handwriting is Mam’s, steady and patient, and I recognise the care she always took over each letter. The photograph shows a girl with half-wet hair and a smile that belongs to both years: me, and not-me. The bottle’s note continues, a second line slipped beneath the first: “Remember who you are, not who you were told to be.” The sun starts to dip lower, turning the harbour into a strip of molten copper, and I feel both the pull of the sea and the pull of who I am becoming. I pocket the shell from the first memory, the note from Mam, and walk away from the wall with a steadier step, knowing memory does not imprison me; it guides me. The two seas inside me—one from childhood, one from choice—have always shaped one identity. Tonight I choose to let them sail together.",
    "notation": false
  },
  "y10-english-lang-writing/practice-0-AQA-core": {
    "question": "Write an approximately 500-word short story for AQA English Year 10 that uses a narrative arc to show rising and then falling intensity. The opening should be concise (about 90–110 words) to establish the setting and mood; the middle should be the longest part (about 260–320 words) containing a turning point; and the ending should be concise (about 60–90 words) that resolves the tension. Set the story in a British coastal town, use a natural Year 10 voice, and create an original plot with clear sensory detail. Do not include diagrams or visual elements.",
    "hint": "Think about how the shape of the story's sections mirrors what happens in the events.",
    "working": [
      "Step 1: Plan the opening section (around 90–110 words) to set scene and mood.",
      "Step 2: Plan the middle section (260–320 words) to contain the turning point with detailed action.",
      "Step 3: Plan the ending section (60–90 words) to resolve the tension and reflect."
    ],
    "answer": "On the first day of the half-term, I stood in the harbour square and watched the boats bobbing like they were listening to a secret. The wind carried the smell of chips and diesel, and the tide pressed at the pilings as if begging for forgiveness. My phone buzzed with Dad’s message: Meet me at the Blue Café at 3. He hadn’t spoken properly since Mum’s last breath, a long time ago that felt like the weather turning sour. So I walked, letting the town shape itself around my feet, a map I could read by feel.\n\nInside the Blue Café, the bell above the door tinkled and the room shrank to heat and coffee steam. Dad sat with his shoulders hunched and the same tired eyes, the kind that have learned to hide trouble in a mug. He kept quiet until the last sip of tea, then pushed a folded envelope across the table. “Go on, open it when you’re ready,” he whispered, not meeting my gaze. I unfolded the map inside: a faded drawing of the lighthouse and a thin line leading to a crack behind the back stairs, where someone had scribbled an “X” in a shaky hand. The page smelled of rain and days.\n\nI followed the map after finishing my tea. The town thinned as I climbed the stairs of the old lighthouse, the wind twisting my scarf like a question mark. Inside, dust skimmed the air and the salt sting in my nose sharpened with courage. In a crevice behind a loose brick I found a small oak box, worn but solid. I prised it open with a coin and discovered a yellowed diary and a locket with a tiny photo of Mum inside. The diary’s first page read, For Mira, when you start to wonder about this place. The entries danced across the page in Mum’s tidy handwriting: days of ordinary chatter, and then sudden lines about choices, about secrets kept to protect us, about forgiveness being something you do, not something you say.\n\nThe diary’s pages argued with my questions. Why had Dad left the truth buried? What was he frightened of? Yet as I turned the pages, I felt a different shape forming in my chest—a certainty that the family wasn’t broken, only bruised by fear. Mum wrote that the bravest thing is to face the truth together, even if it hurts. The map had led me to a truth that could heal us if I shared it.\n\nBack at the cliff edge, evening light touched the water with gold. I tucked the diary away and whispered to Mum that I would help us tell the truth when the time was right. The sea answered with a slow, forgiving sigh. I moved towards the town, lighter than when I arrived, carrying not a secret, but a plan: to speak honestly with Dad, to let the memory of Mum guide us back to each other.",
    "notation": false
  },
  "y10-english-lang-writing/practice-3-AQA-core": {
    "question": "Write a short story of about 600–700 words for a GCSE English Language assessment. Your story must use a circular structure: it should begin with the exact line “The door creaked as I pushed it open, and the hall smelled of rain and old wood.” and it must end with the same line, echoing the start. The narrator is sixteen and returns to a family home after many years; through memory and present tense, show how the place triggers feelings and reveals something about them. Use varied sentence lengths and paragraphs to shape pace, and show, not tell, by using sensory detail and inner reflection. Do not include any diagrams or references to external sources. Aim for a clear turning point around halfway, after which tone shifts. Keep language accessible and appropriate for Year 10 readers.",
    "hint": "Plan the circular idea first—start and finish with the same line, and use the middle to shift what the narrator understands about themselves.",
    "working": [
      "Plan a circular structure by starting and ending with the same line.",
      "Create sensory detail for each room to reveal memories and feelings.",
      "Include a turning point around halfway where the protagonist reframes their view.",
      "Ensure the final line is identical to the opening line."
    ],
    "answer": "The door creaked as I pushed it open, and the hall smelled of rain and old wood. I am sixteen, though the city streets outside whisper that I should be older by now. The house answers me in breathy sighs—the kettle’s lid still sits crooked on its pot, the radiator wheezes like an old man waking from a long sleep, and the paint on the walls holds the summer heat of a dozen summers ago. I walk slowly, as if walking could slow down time, and the floorboards press back in little polite groans as if to remind me of every game I played where I was always catching up.\n\nThe hallway is a corridor of faces. A line of photographs watches from the wall, their eyes following me with careful curiosity. I pause at the stairwell, where the carpet has a stain that once looked like a treasure map to me, and now looks like a small city of its own. The scent of lemon polish jars me back to a time when I learned to dust without complaint, when I believed a tidy room could shield me from whatever lay beyond a doorstep.\n\nIn the kitchen, the kettle sits like a patient animal, and the bread tin gleams with the memory of a loaf that never quite rose the way it should have. Outside, the rain stains the windows and I can hear the sound of traffic on the street that is not my street, the sound of a world moving on without me. I am sixteen, yes, but the house keeps begging questions I don’t know how to answer.\n\nA clock ticks in the living room, and in that ticking I hear the quiet argument I have with myself about whether I belong here any longer or only in the memory of belonging. I touch the mantelpiece where a family photograph rests—the three of us smiling with a certainty that now feels almost silly, almost unreachable. I used to imagine I could step inside the frames and pull myself back into those bright days; today I realise that those days belong to a past version of me, not to the person who stands in the doorway with damp sleeves and a stubborn ache in the chest.\n\nHalfway through the house I find a small box in the attic, tucked behind a loose tile where the dust glitters like a pale constellation. Inside is a collection of letters from when I was younger, all written in a hand that trembles with excitement and fear. There are promises I made to little me: to stay brave, to be kind, to see the world without letting it swallow me whole. Reading them, I feel a careful, almost tender embarrassment for how much hope I carried then, and how often I have let reality crumple that hope into a soft, quiet ruin.\n\nFor a moment the ache is a teacher, because it reminds me that to grow up is not to erase myself from my past, but to let the past stand a little taller in front of you as you move forward.\n\nI realise that returning here does not require me to become who I was, but to listen to who I am becoming. I notice the small ways the house has changed while I’ve been away—glimmers of new paint on the walls, a kettle that now sings instead of sighs, a chair I do not remember sitting in but which feels like mine nonetheless. The tension between memory and present moment loosens, and I understand that home is not a cage but a map, and I am learning to read it with more honesty.\n\nWhen I step back into the hallway to leave, the rain has stopped. I walk toward the door with a steadier breath, not begging the house to understand me, but promising to carry what I have learned as I step back into the day beyond the doorstep. The door creaked as I pushed it open, and the hall smelled of rain and old wood.",
    "notation": false
  },
  "y10-english-lang-writing/practice-4-AQA-core": {
    "question": "Write a 600–700 word narrative from the perspective of a Year 10 student revisiting a familiar place after hours, showing how the setting changes their mood and outlook. Use ambitious vocabulary to create vivid imagery and tone. Include at least five ambitious adjectives and three strong verbs, and vary sentence structures. Your piece should be suitable for the GCSE AQA English syllabus. Describe the moment you discover something extraordinary in a mundane place, and explain how that discovery affects you.",
    "hint": "Think about a place you know well and how it can surprise you if you slow down and listen to small details.",
    "working": [
      "Step 1: Decide who is telling the story, where the place is, and what discovery will happen.",
      "Step 2: Create a short list of five ambitious adjectives and three strong verbs to weave into the writing.",
      "Step 3: Draft the piece with attention to mood, imagery, and varied sentence lengths and beginnings.",
      "Step 4: Revise to ensure vocabulary is ambitious, the tone is consistent, and the piece stays within 600–700 words."
    ],
    "answer": "Midnight breathed through the library windows as I pushed the door and it sighed open, releasing a chorus of dust motes that danced in the beam of the street lamp outside. The familiar shelves rose like dark cliffs, their spines etched with the years I have spent pretending I’m not listening to them. The air tasted of rain on warm stone and old paper, a scent that felt both comforting and almost holy. I had come here to cram for a test, but the quiet held a secret I could not yet name.\n\nI moved along the labyrinthine aisles, the carpet sighing beneath my shoes, until a soft glimmer caught my eye—an opalescent glint behind a tall portrait of the founder. The picture hung crooked, as if it too wished to mislead me away from what lay behind it. I prised the edge of the frame with care, and a thin panel shifted, revealing a cramped recess. Inside sat a single folded parchment, its corners browned with age. My fingers trembled as I unfolded it, discovering a hand-drawn map that spiralled like a seashell, marking routes through corridors I had never walked, ending at a small iron grate by the back wall.\n\nI followed its markings, stepping lightly to avoid creaking floorboards, each clue guiding me to rooms that had never shown themselves to me during daylight. The stairwell grew tenebrous and then suddenly luminous as I pushed through a back door onto a narrow stair, above which a pale dusted light filtered through a skylight. I emerged into a hidden courtyard that did not exist on any timetable or floor plan—the Listening Garden, a place that seemed to have grown out of the building’s memory.\n\nThe garden was not full of flowers but of stories: lanterns hung from branches like tame stars, their glow casting a soft, ethereal light across stones worn smooth by countless footsteps. A low, distant murmur rose and fell, as if the walls themselves were speaking in a choir of patient voices.\n\nIn the centre stood a weathered bench, carved with initials and a date that felt older than the school. On the seat lay a small brass plaque, engraved with a message that made my chest tighten: “To those who listen, the walls remember.” The garden’s whispers swelled and then settled into a cadence that felt almost human, telling me that every choice I make will ripple beyond the moment. A surge of realisation ran through me—this place, long assumed merely as a backdrop to exams and routine, was a living archive of possibility.\n\nI stood and let the atmosphere soak into me. The air, once merely cool, now carried a portentous, almost reverent weight. My nerves settled; the fear of failing softened into a steady resolve. If this place could keep memories safe and still offer new doors, then perhaps I could, too—not by sprinting toward a single, decisive moment, but by listening closely to the small, honest details of every day. The garden’s quiet insisted that I slow down, observe, and choose with intention rather than impulse.\n\nWhen I retraced my steps to the door, the normal sounds of the school appeared again—footsteps in corridors, the distant hum of a radiator, the rustle of a page turned somewhere beyond the library—but they felt different, charged with an unseen energy. The walls, it seemed, had opened a window into another version of me, one who can be patient, resilient, and hopeful.\n\nBack in the corridor, the fluorescent lights hummed with a steady, indifferent brightness, yet my shoulders were lighter, my breath less jagged. The ordinary path to the exit looked almost ceremonial now, a route I would walk with a new awareness of what I might discover if I pause and listen again. I stepped into the night with a small, ready courage, certain that the following day would feel less like a fight against the clock and more like a careful, deliberate choice to write my own future—with words as my instruments and curiosity as my compass.",
    "notation": false
  },
  "y10-english-lang-writing/practice-5-Edexcel-core": {
    "question": "Question 6 (Creative Writing – Control accuracy). Write a story of about 480 words in the voice of a Year 10 student who is learning to ride a bike in a park at dusk. Your writing should demonstrate control of punctuation and sentence length to create mood and pace. Include at least one long sentence and one short sentence to show how rhythm affects the scene. Use a range of punctuation accurately (commas, full stops, question marks and exclamation marks). Do not refer to real people or events.",
    "hint": "Think about how you can slow the moment with a long sentence and speed it up with a short one to convey nerves and action.",
    "working": [
      "Step 1: Decide the narrator (Year 10 student) and setting (park at dusk) and plan a moment of challenge on a bike.",
      "Step 2: Plan one deliberately long sentence to slow the pace, and one short sentence to create punch or urgency.",
      "Step 3: Plan to use a range of punctuation accurately (commas, full stops, question marks, exclamation marks) to show control.",
      "Step 4: Draft the story so the tone reflects a reflective Year 10 voice and ends with a sense of progress."
    ],
    "answer": "By the time I reached the park, the evening light had turned the path orange. I was in Year 10, old enough to solve equations and take the bus alone, but apparently not old enough to balance on two wheels. My brother had lent me his bicycle and promised not to laugh. He was waiting beside the gate, studying the clouds with suspicious determination.\n\n“Ready?” he asked.\n\nI nodded, although the handlebars felt slippery and my stomach seemed to have slipped somewhere below the saddle. While he held the back of the seat, I placed one foot on a pedal, pushed with the other and tried to remember everything he had said about looking ahead, keeping my arms loose and trusting a machine that appeared determined to throw me into a hedge.\n\nWe moved. For three glorious seconds, we moved.\n\nThen I looked down. The front wheel turned towards a patch of grass, my foot missed the pedal, and the whole arrangement folded sideways. I landed sitting upright, still gripping the handlebars as though I could persuade the bicycle that this had been deliberate. Somewhere beyond the trees, a car door slammed. Even that sounded like applause from an unkind audience.\n\nMy brother crouched beside me. “Again?”\n\n“Give me a minute.”\n\nThe grass was cool through my trousers. A blackbird hopped along the fence, stopped and tilted its head. I imagined explaining the problem to it: two wheels, two feet, no agreement between them. Above the roofs, the remaining sunlight narrowed to a thin gold stripe. I could go home now. I could say we had run out of daylight.\n\nInstead, I stood up. I brushed a green stain from my knee and checked that the wheels still turned. My brother waited without speaking. For once, his silence felt helpful rather than embarrassing.\n\nThis time I watched the bench at the far end of the path. I pushed steadily, listened to the chain clicking and let the small wobbles happen without trying to fight every one. My brother's footsteps followed me. Then they grew quieter. The path opened ahead, smooth and unexpectedly wide, and the wind touched my face as if somebody had opened a window.\n\n“You're doing it!” he called.\n\nI nearly turned to answer. Nearly. I kept my eyes on the bench, squeezed the brakes gently and put one foot down before the bicycle stopped completely. My legs were shaking, but the bike remained upright. So did I.\n\nMy brother reached me, breathing harder than I was. He held out his hand for the handlebars. I tightened my grip, feeling the rubber warm beneath my fingers, and glanced back along the empty path. The park had not changed: the same fence, the same bench, the same bird. Yet the distance between them had become something I could cross.\n\n“One more go,” I said.",
    "notation": false
  },
  "y10-english-lang-writing/practice-6-Edexcel-core": {
    "question": "Write a 500–600 word creative writing piece that uses a circular structure. You must begin with a vivid image of a winter park bench at dusk and end by returning to that same scene, but with a change in the narrator or the meaning. Include at least one recurring motif that appears in both the opening and the ending (for example, a coin, a song, or a streetlight). Use clear paragraphs and language appropriate for Year 10 English. Do not refer to diagrams, graphs, or tables. Do not reproduce a real exam paper question.",
    "hint": "Think about how the ending can look back to the opening scene, but show that the narrator has learned or changed in some way.",
    "working": [
      "Plan the circular structure with an opening image and closing image of the same bench.",
      "Decide on a recurring motif (the 20p coin) to appear at both ends.",
      "Outline the middle to show the narrator’s change in perspective.",
      "Ensure the ending echoes the opening scene but with a new understanding."
    ],
    "answer": "The winter park bench glowed faintly under the orange streetlight as dusk folded over the trees. Frost dusted the wood like a thin layer of icing, and a small 20p coin lay on the arm, blinking in the pale glow before it clinked lightly when a breeze slipped by. I was meant to be celebrating the end of GCSE mocks, but my feet had led me here instead, to a place where the only sound was the hush of snow and distant traffic. The bench seemed to listen as I let out a long breath I did not realise I had been holding.\n\nLast week’s protests and promises still buzzed in my head. I’d argued with Mia about what I should do after school, about whether my plan to study drama was foolish or brave, about whether I was good enough to chase a dream that felt bigger than me. She had laughed at first, then pointed out all the things I’d failed to notice about myself: the fear I hid behind jokes, the way I paused before speaking, the way I cared more about making others feel good than about my own needs. The coin sat there between us in memory—a small piece of metal that felt like luck and like proof that someone had dropped by to remind me I mattered. Now it felt heavier, a reminder of the moment I realised I was not merely drifting through days but choosing how to spend them.\n\nI picked at the frost while I watched the lamp’s yellow eye flicker. The argument with Mia had shown me that I cannot simply wait for opportunities to arrive; I must walk to meet them. So I wrote a message in my head to Mia, not a grand confession but a simple plan: I would ask for her honest opinion about a monologue I’ve been writing, and I would tell her I want to try something that makes me nervous. The coin stayed in my pocket this time, not as luck but as a quiet reminder to act, to hold on to what I promised myself I would do.\n\nI stood up, pocket warm from the coin, and tucked the message away with the same careful resolve I’ve learned to use when I’m about to read aloud in class. The path away from the bench was clear and I walked it with a new pace, as if the ground itself approved of me taking a chance rather than merely avoiding failure. The gusts of wind carried a faint song from a distant street, not a lullaby but something sharper, something that nudged me to keep going, to choose a line of dialogue that sounds like me and not like someone else’s idea of me.\n\nAt last I turned back toward the bench, and there it was again—the winter park bench under the lamp, the frost glittering, the coin still in my pocket, no longer a mere token but a symbol of a decision finally made. I did not sit this time, not yet. I stood and watched the scene as if for the first time, noticing how the light threw long shadows and how the air tasted of cold rain and possibility. The same bench, the same coin, yet everything had shifted inside me.\n\nI walk away again, carrying the coin as a small, steady promise that I will try, not just dream. The winter park bench glows in the night, a constant harbour, and I am ready to return to it with words that are mine.",
    "notation": false
  },
  "y10-english-lang-writing/practice-9-AQA-core": {
    "question": "Shape structure. Write a short story of about 320–360 words that uses a deliberate shape to reflect the events. Your piece should be told in the first person, in the past tense, from the perspective of a Year 10 student. The structure must be five paragraphs with this exact sentence pattern: paragraph 1 – 1 sentence; paragraph 2 – 2 sentences; paragraph 3 – 2 sentences; paragraph 4 – 2 sentences; paragraph 5 – 1 sentence. The content should centre on a moment when you realise something important about a friend or about a situation at school.",
    "hint": "Think about how the shape of the paragraphs can mirror what happens in the story and guide the reader’s pace.",
    "working": [
      "Step 1: Decide the 1-2-2-2-1 sentence pattern for the five paragraphs.",
      "Step 2: Create a simple, relatable scenario for Year 10 students—an incident that leads to a realisation about a friend.",
      "Step 3: Draft the piece in first person past tense, keeping to the exact sentence counts per paragraph.",
      "Step 4: Check that the total word count is in the 320–360 range and adjust as needed."
    ],
    "answer": "The corridor air tasted of chalk and rain as I stood outside the music room after lunch, listening to the hum of voices swell and fade, wondering whether today would offer anything different from the same old routine, when the bell would finally ring and release us into the fleeting certainty of the last period's timetables and the uncertain future that waited beyond the school gates.\n\nI lingered by the lockers, listening for the click of the door that would end the wait, and there I saw Mia slide a folded note into Jake's bag with careful, almost ceremonial precision, as if she were handling something fragile and dangerous at once. Her hands trembled only a little, and when she glanced toward the door, her eyes avoided mine, as though she wanted to pretend the moment in the corridor had never happened.\n\nI did not say a word; I merely turned away and pretended to read my timetable, but the image of Mia's careful fingers and Jake's widening shoulders kept surfacing in my memory like a bad song that would not fade. That night, I lay in bed listening to the rain against the window and thought of the note, and of the way hints can hurt more than blunt truth when they slip under someone's skin.\n\nIn the morning I found Mia in the corridor and asked, quietly, if she would mind telling me what was really going on, and she spoke haltingly about fear of being the one who started something she couldn't stop, and about a plan that had spiralled out of control. Hearing her talk, I realised I had leant on the easy story, the one where friends are tainted by a single action, while ignoring the far more complicated landscape of fear and pressure behind every choice.\n\nSo the next day I spoke honestly, began again with both of them, and walked into the next lesson believing that truth told with care could shape us all for the better.",
    "notation": false
  },
  "y10-english-modern/exam-3-Edexcel-core": {
    "question": "In this extract from a contemporary drama about a family moving to a new town, analyse how the relationship between Elena and Kai is presented. In your answer, refer closely to how language choices reveal tension, power and care. Use the dialogue included in this original teaching extract to support your analysis. EXTRACT: ELENA: We’re not staying. The job is in Manchester, and you know it. KAI: So you lied to me about the audition? You told me you explained everything, but you didn’t say we were moving. ELENA: I said there would be changes. I didn’t lie, I delayed the truth to give you a chance to thrive wherever we end up. KAI: You think I can just thrive? You think this is a choice? ELENA: Of course it is a choice. It’s about your future, not about what you want this minute. KAI: My future is here with my friends, in this school, in this town. You’re packing my things into boxes like I’m a thing. ELENA: I am not a thing. I’m your mother who loves you. I’m trying to do what’s best. KAI: Then tell me the truth. If you’re moving, I’ll come. If you’re not coming, I’ll stay and finish the year. ELENA: Kai, I’m moving us. I want you to have the chances you deserve. I’m not giving up on you. KAI: I’m scared. I’m angry. And I hate you for this.",
    "marks": 6,
    "markScheme": [
      "Identifies that the extract presents a strained, conflicted mother–son relationship, shown through direct confrontation and blame.",
      "Explains how Kai asserts agency and challenges Elena’s authority, revealing a shifting power dynamic.",
      "Analyses Elena’s rhetoric of care and obligation (eg, “It’s about your future”) and how it justifies the move while masking control.",
      "Explores the line “you’re packing my things into boxes like I’m a thing” to show Kai’s sense of dehumanisation and loss of control.",
      "Explains how short statements and repeated questions intensify the disagreement.",
      "Explains the unresolved mixture of fear, anger and attachment in Kai’s final words."
    ],
    "answer": "Elena’s “We’re not staying” establishes her control over the decision. Kai’s accusation that she “lied” shows damaged trust, while his repeated references to “this school” and “this town” emphasise what he fears losing. Being packed “like I’m a thing” suggests that he feels deprived of agency. Elena presents her decision as care through “your future” and “I’m not giving up on you”, but Kai experiences it as coercion. His closing “I’m scared. I’m angry.” uses brief statements to expose emotions beneath the argument. The dialogue leaves the relationship strained; there are no supplied stage directions to quote.",
    "notation": false
  },
  "y10-english-nonfiction/exam-7-AQA-core": {
    "question": "Read the passage below. Then: Summarise information from it, in no more than 90 words, using your own words. Identify three to four main points and present them as a concise paragraph. Passage: Last Saturday, the charity 'Bright Futures' held a community fundraiser in the town hall and along the high street. Volunteers sold cakes, ran a charity raffle, and collected donations from passers-by. The event brought together 120 people and raised £4,120. Organisers say the money will buy science equipment for the local primary school and fund a seasonal meals programme for families in need. The charity hopes to repeat the event next year and is planning a second fundraiser in the autumn.",
    "marks": 4,
    "markScheme": [
      "Identifies the purpose of the event and summarises it in own words.",
      "Mentions the main activities described (cakes, raffle, donations).",
      "States the key outcomes: attendance and amount raised, and how the money will be used.",
      "Notes future plans (repeat next year and autumn fundraiser) in their own words."
    ],
    "answer": "Bright Futures organised a Saturday fundraiser in the town hall and on the high street, with volunteers selling cakes, running a raffle and collecting donations. The event drew 120 attendees and raised £4,120. The funds will buy science equipment for the local primary school and support a seasonal meals programme for families in need. Organisers plan to repeat the event next year and run another fundraiser in the autumn.",
    "notation": false
  },
  "y10-english-nonfiction/practice-5-Edexcel-core": {
    "question": "Read the fictional teaching appeal below for an invented local charity fundraiser and answer: Explain how the writer uses persuasive methods to encourage readers to donate. You should refer to at least three techniques and include quoted phrases from the extract to support your analysis. Extract: \"Dear neighbour, every day, families in our town wake up to cold houses and empty cupboards. The charity Hope for Homes has helped hundreds, but we still have 60 families waiting for a warm bed and a hot meal this winter. If you can give just £5 today, you can sponsor a family for a week. A gift of £20 could fund a night shelter for two families. You can donate by text or online, and every penny goes directly to relief. Please act now—your kindness can restore hope to someone who has nothing left but a little warmth and care. Thank you for reading this appeal.\"",
    "hint": "Look for emotive language, direct address and concrete donation details.",
    "working": [
      "Step 1: The extract uses emotive imagery ('cold houses and empty cupboards') to evoke sympathy and urgency.",
      "Step 2: It uses direct address and second-person pronouns ('Dear neighbour', 'you') to involve the reader and create a sense of personal responsibility.",
      "Step 3: It includes imperative language and urgency ('Please act now') to push for immediate action.",
      "Step 4: It provides concrete donation amounts ('£5', '£20') and reassurance ('every penny goes directly to relief') to make giving feel doable and trustworthy."
    ],
    "answer": "The image of “cold houses and empty cupboards” encourages sympathy by presenting deprivation in concrete terms. Direct address in “Dear neighbour” creates a local connection and makes the reader feel personally involved. The imperative “Please act now” adds urgency. Small suggested gifts such as “£5” make donating seem manageable, while “every penny goes directly to relief” reassures readers. That assurance is a persuasive claim within a fictional appeal, not verified evidence about a real charity.",
    "notation": false
  },
  "y10-english-poetry/practice-5-Edexcel-core": {
    "question": "Read this original teaching poem, “A Street in the Industrial Town”. It is a practice stimulus, not an attributed Edexcel anthology poem: \"Chimneys cough a black rain over the cobbles, pockets heavy with borrowed coins and patched coats. The hour bell drags the morning through the soot, an old man counts his wages by the doorway. Girls with ragged sleeves scrub the hours away, while the drums of iron beat the day into night. Coal dust clings like memory to every shawl, and a child slips between shadows—the street keeps its breath.\" Explain how the context of industrial Britain helps you understand the poem's portrayal of work and poverty. Support your answer with references to the poem's language and imagery.",
    "hint": "Consider how the imagery of factories, wages and long hours shape the poem's message about life in a connected town.",
    "working": [
      "Step 1: Identify the clues in the poem, such as chimneys, soot, wages, hour bell, and patched coats, that point to factory work and urban living.",
      "Step 2: Connect these clues to the historical context of Britain during industrialisation, when towns grew around factories and many people lived in poverty with long working hours.",
      "Step 3: Explain how this context helps the reader understand the poem’s tone and focus on routine, hard labour and resilience, seen in phrases like “the hour bell drags the morning” and “drums of iron.”",
      "Step 4: Link the imagery (coal dust, memory, patched coats) to ideas about social conditions, work, and community life in industrial towns."
    ],
    "answer": "The teaching poem evokes industrial Britain through “Chimneys”, “soot” and the “hour bell”, linking work to pollution and regulated time. “Patched coats” suggests poverty, while the bell that “drags the morning” makes labour feel exhausting. Knowledge of industrial towns helps explain these associations, but the poem is a modern teaching text and is not direct evidence of a historical worker’s experience.",
    "notation": false
  },
  "y10-english-poetry/practice-9-Edexcel-core": {
    "question": "Read this original teaching poem, Snow Street. Analyse how language and form convey isolation.\n\nSnow clings to the gutter, glittering pale,\nStreetlamps sigh, and tremble in the rain;\nMy footsteps echo, hollow as a chain,\nAlone I walk where every sound is thin and frail.",
    "hint": "Use the displayed line breaks and punctuation, and support each interpretation with an exact quotation.",
    "working": [
      "The cold image of snow and the solitary declaration “Alone I walk” establish isolation. Personifying the streetlamps as sighing and trembling gives the surroundings an uneasy quality.",
      "The four-line stanza uses an ABBA rhyme pattern: pale/frail surrounds rain/chain. That enclosed pattern can suggest that the speaker is held within this lonely setting.",
      "Punctuation marks each line ending, including the semicolon after “rain”, creating pauses. This is not evidence of enjambment between lines 2 and 3. The longer final line extends the description of the speaker's isolation."
    ],
    "answer": "The cold image of snow and the solitary declaration “Alone I walk” establish isolation. Personifying the streetlamps as sighing and trembling gives the surroundings an uneasy quality.\n\nThe four-line stanza uses an ABBA rhyme pattern: pale/frail surrounds rain/chain. That enclosed pattern can suggest that the speaker is held within this lonely setting.\n\nPunctuation marks each line ending, including the semicolon after “rain”, creating pauses. This is not evidence of enjambment between lines 2 and 3. The longer final line extends the description of the speaker's isolation.",
    "notation": false
  },
  "y10-english-shakespeare/exam-1-Edexcel-core": {
    "question": "Question 2 (Extract from William Shakespeare's Macbeth, Act 1 Scene 1). The three witches speak at the opening of the play, creating a mood of mystery and danger. Read the extract below and answer: How does Shakespeare use dramatic methods to create tension and an otherworldly atmosphere in this extract? You should refer to the language and imagery, and to the way the lines are written, to explain how the effect is produced. Extract from Macbeth, Act 1 Scene 1: When shall we three meet again? In thunder, lightning, or in rain? When the hurly-burly's done, When the battle's lost and won. That will be ere the set of sun. Where the place? Upon the heath. There to meet with Macbeth. I come, Graymalkin! Paddock calls. Anon! Fair is foul, and foul is fair. Hover through the fog and filthy air.",
    "marks": 6,
    "markScheme": [
      "Identifies how weather and natural imagery (thunder, lightning, rain) create a foreboding atmosphere.",
      "Explains the paradoxical refrain \"Fair is foul, and foul is fair\" to signal moral confusion and tension.",
      "Describes the chant-like, rhythmic structure and short, memorable lines that heighten a sense of ritual and unease.",
      "Notes the use of alliteration and harsh consonant sounds (e.g., hurly-burly, heath, filthy air) to produce a spooky, musical effect.",
      "Points out the supernatural elements (three witches, meeting in a wild place, familiars) that make the scene feel otherworldly.",
      "Discusses how the setting on the heath and the idea of meeting again with Macbeth foreshadow fate and danger, creating anticipation for what is to come."
    ],
    "answer": "Shakespeare opens with a stark, ritual mood that immediately signals something unnatural is at play. The opening question, When shall we three meet again? In thunder, lightning, or in rain?, uses weather as a dramatic instrument to suggest menace and the possibility of prophecy. The reference to thunder and stormy elements makes the witches feel superhuman and otherworldly, as if they belong to a world outside ordinary life. The next lines continue with a chant-like rhythm: When the hurly-burly's done, When the battle's lost and won. The repetition and the compact clauses create a hypnotic cadence, like a spell, which heightens tension and makes the witches seem to perform a ritual rather than merely speak. The phrase That will be ere the set of sun marks a looming deadline and adds urgency. The setting on the heath reinforces isolation and wildness, away from civilisation, which contributes to unease and a sense that anything could happen. The stage direction-like line There to meet with Macbeth and the abrupt I come, Graymalkin! Paddock calls. Anon! introduce the witches’ animal familiars and suggest a supernatural world, unsettling the audience. Crucially, the famous paradox Fair is foul, and foul is fair places moral instability at the centre of the extract. This inversion signals that appearances will mislead and that danger may lie behind ordinary things, which maintains tension and anticipation for the drama to come. In summary, Shakespeare uses weather imagery, paradox, chant-like rhythm, sound devices, and supernatural associations to engineer a tense, otherworldly atmosphere that grips the audience from the opening lines.",
    "notation": false
  },
  "y10-english-shakespeare/exam-3-AQA-core": {
    "question": "Read these short selections from Macbeth, Act 1 Scene 7. The ellipsis marks omitted dialogue. Explain how the speakers present different ideas about courage and how Lady Macbeth challenges Macbeth’s hesitation.\n\nMACBETH: I dare do all that may become a man.\nWho dares do more is none.\n[…]\nLADY MACBETH: When you durst do it, then you were a man;\nAnd to be more than what you were, you would\nBe so much more the man.\n\n“Become” here means be fitting for; “durst” means dared. Text checked against the Folger Shakespeare Library edition.",
    "marks": 6,
    "markScheme": [
      "Identifies Macbeth’s assertion that courage has moral limits.",
      "Explains “all that may become a man” as conduct he considers appropriate.",
      "Explains “Who dares do more is none” as rejection of actions beyond those limits.",
      "Identifies Lady Macbeth’s challenge to his masculinity.",
      "Explains her repeated “man” and comparative “more” as pressure to prove himself.",
      "Compares their competing definitions of courage using accurate evidence."
    ],
    "answer": "Macbeth defines courage through limits: “all that may become a man” links bravery with fitting conduct, while “Who dares do more is none” suggests that crossing the boundary would diminish him. Lady Macbeth reverses this by claiming he was a “man” when he dared to pursue the murder. Repeating “more” offers a stronger masculine identity as a reward for action. Their disagreement turns ambition into a dispute over courage and self-worth; her argument pressures him to treat hesitation as failure.",
    "notation": false
  },
  "y10-english-shakespeare/exam-9-AQA-core": {
    "question": "In Macbeth, Act 1 Scene 7, Macbeth considers killing Duncan. Analyse how this short extract presents his motivation. Use its language as evidence.\n\nI have no spur\nTo prick the sides of my intent, but only\nVaulting ambition, which o’erleaps itself\nAnd falls on th’ other—",
    "marks": 6,
    "markScheme": [
      "1 mark: identifies ambition as the motive Macbeth explicitly names.",
      "1 mark: quotes a relevant phrase accurately.",
      "1 mark: explains the riding metaphor of the spur as an incentive to act.",
      "1 mark: explains that “no spur” suggests a lack of other justification.",
      "1 mark: explains how overleaping and falling suggest ambition may cause failure.",
      "1 mark: develops a supported interpretation of Macbeth's self-awareness or internal conflict."
    ],
    "answer": "Macbeth explicitly names “Vaulting ambition” as his motive. The riding image in “no spur / To prick the sides of my intent” suggests that he lacks another incentive or justification for murder. “But only” narrows the explanation to ambition itself.\n\nThe ambition “o’erleaps itself” and “falls”, so the image also anticipates failure: the drive to rise can become the cause of a fall. Macbeth recognises this danger while still contemplating the act. The passage therefore presents self-awareness and conflict, not a belief that murder is morally justified.",
    "notation": false
  },
  "y10-english-shakespeare/practice-8-AQA-core": {
    "question": "Read Lady Macbeth’s words from Macbeth, Act 1, Scene 5:\n\n“Come, you spirits\nThat tend on mortal thoughts, unsex me here”\n\nExplain how language conveys her desire for power and how knowledge of gender expectations and supernatural beliefs in Shakespeare’s Jacobean context can inform an interpretation. Avoid treating all audience members as sharing one response. Source: Folger Shakespeare Library.",
    "hint": "Consider the imperative Come and what Lady Macbeth wants to reject through unsex.",
    "working": [
      "The imperative Come presents an attempt to summon and command supernatural forces.",
      "Unsex can suggest rejecting qualities she associates with femininity, especially pity or nurturing.",
      "Connect this to gender expectations rather than claiming that women had no influence at all.",
      "Discuss a possible audience response to invoking spirits without assuming a universal reaction."
    ],
    "answer": "The imperative “Come” gives Lady Macbeth a commanding voice, while her address to “spirits” places that desire for authority in a supernatural setting. “Unsex me here” can be read as a wish to reject the pity and nurturing she associates with femininity so she can pursue violent ambition. It need not mean a literal request to become a man. In a society with strongly gendered expectations, such a rejection could seem disturbing or challenging. Invoking spirits could also create unease for audience members who associated them with dangerous supernatural forces. Context helps explain these possibilities; it does not establish that every Jacobean spectator held identical beliefs.",
    "notation": false
  },
  "y10-english-spoken/practice-5-AQA-core": {
    "question": "You are giving a five-minute talk to your class about plastic waste and its effect on marine life. After your talk, a member of the audience asks: 'What are three practical things I can do at home to reduce plastic pollution?' Write a spoken response to that question, addressing the audience directly, giving three clear actions with brief explanations, and including one personal example. Your answer should be suitable to read aloud to the class.",
    "hint": "Start with the most practical action that the audience can do immediately.",
    "working": [
      "Step 1: Plan a short spoken answer that lists three clear actions with brief explanations and includes a personal example; use direct address to the audience.",
      "Step 2: Use straightforward language, signpost each action with a number, and include a quick personal example to make it relatable.",
      "Step 3: Conclude by linking back to the talk and encouraging ongoing small, everyday changes."
    ],
    "answer": "Thank you for asking. First, choose loose fruit or vegetables when that is practical, so you bring home less unnecessary packaging. For example, I now put loose apples into a bag we already own.\n\nSecond, keep using a refillable bottle instead of buying a disposable one each day. The benefit comes from repeated use, so there is no need to keep buying new reusable bottles.\n\nThird, check your local recycling instructions and sort accepted items correctly. Rules differ, and putting the wrong item in a recycling bin does not make it recyclable.\n\nThose are three manageable steps: reduce packaging, reuse your bottle and sort waste carefully. They reduce avoidable waste; they do not solve marine pollution on their own.",
    "notation": false
  },
  "y10-english-spoken/practice-9-AQA-core": {
    "question": "You are preparing a presentation arguing that your school should improve its library. Your ideas are: explain the current problem; suggest improvements; show how pupils would benefit. Plan a clear introduction, order the main points and write a closing request to the audience.",
    "hint": "Give the audience a reason to listen, connect your ideas and finish with a clear purpose.",
    "working": [
      "Introduce the problem and state the purpose: the library needs improvement so pupils can read and study effectively.",
      "Explain the current problem, propose improvements and then show how those improvements would help pupils.",
      "Use signposts such as “First”, “To address this” and “As a result” to make the argument easy to follow.",
      "Conclude by summarising the benefit and asking the school council to discuss the proposal."
    ],
    "answer": "One effective structure is introduction → current problem → proposed improvements → benefits → a specific request for action. Other coherent sequences are valid.",
    "notation": false
  },
  "y10-english-spoken/practice-9-Edexcel-core": {
    "question": "You are preparing an eight-minute presentation for your Year 10 English class on the topic \"Why healthy sleep matters for school performance\". You will use six slides. Outline the slide order (numbers 1 to 6) and the content for each slide using 1–3 bullet points per slide. For Slide 3, state two key points you will include. Finish with one sentence explaining why you chose this order to help your audience follow your argument.",
    "hint": "Think about starting with a clear aim, then build the argument logically from introduction to evidence to conclusion.",
    "working": [
      "Plan the six-slide sequence: Intro, Point 1, Point 2, Evidence/Examples, Practical tips, Conclusion.",
      "For Slide 3, include two explicit key points to support Point 2.",
      "Keep each slide’s content concise (1–3 bullets) and suitable for Year 10 readers."
    ],
    "answer": "Slide 1 — Title and aim\n- Why healthy sleep matters for school performance.\n- Introduce the links to memory, attention and mood.\n\nSlide 2 — Memory and learning\n- Explain the proposed link between sleep and remembering learning.\n- Introduce a classroom example as illustration, not research evidence.\n\nSlide 3 — Attention and mood\n- Key point 1: discuss how tiredness can affect attention.\n- Key point 2: discuss how tiredness can affect mood and participation.\n\nSlide 4 — Evidence\n- Present a relevant finding from a reliable source and name the source.\n- Explain what it shows and any limits; do not invent study results.\n\nSlide 5 — Practical discussion\n- Discuss routines and barriers students may face.\n- Invite realistic suggestions without blaming individuals.\n\nSlide 6 — Conclusion\n- Recap the three main links.\n- Invite the audience to consider one manageable improvement to their routine.\n\nThis order introduces the purpose, develops the key ideas, tests them against evidence and finishes with practical reflection, helping the audience follow the argument.",
    "notation": false
  },
  "y10-english-transactional/exam-0-AQA-core": {
    "question": "You are a Year 10 student organising a charity fundraising event at your school. Write a formal letter to the manager of a local gym, requesting sponsorship for a sponsored circuit workout to raise funds for a local food bank. The letter should adapt tone to suit a business reader (formal, respectful, and persuasive). Include a clear opening stating purpose, a brief outline of the event, three reasons the sponsor would gain from supporting the event, and a closing request for a meeting or reply. Aim for about 200 words.",
    "marks": 4,
    "markScheme": [
      "Clear purpose stated and tailored to a business reader.",
      "Concise outline of the event and relevant details included.",
      "Three persuasive reasons given for sponsorship, with a call to action.",
      "Formal letter conventions, accurate spelling/grammar, and appropriate tone used throughout."
    ],
    "answer": "Midtown Fitness Centre Unit 3, The Arcade 12 High Street Townville\n\nDear Mr Patel,\n\nRe: Sponsorship for Riverside High School charity circuit fundraiser\n\nI am a Year 10 student organising a charity event at Riverside High School and am writing to request your sponsorship for a sponsored circuit workout to raise funds for Townville Food Bank. The event will be a 60‑minute circuit in our school gym, with six exercise stations. Approximately 120 participants are expected, and all proceeds will go to the food bank. The aim is to promote healthy activity while supporting local families.\n\nThree reasons your sponsorship would benefit Midtown Fitness Centre: first, brand exposure through banners, posters, and posts on our school and local social media; second, positive community PR aligning with health and charitable work; third, staff involvement opportunities, such as volunteering at a station or providing a short demonstra­tion, which can raise your profile in the community.\n\nIf you sponsor us, we will acknowledge Midtown Fitness Centre on all promotional materials, credit you on the school website, and thank you publicly at the event. I would be grateful for a brief meeting or a reply at your convenience to discuss this further. I can be contacted at acarter@example.org or through the school office.\n\nYours sincerely,\nAlex Carter\nYear 10 student, Riverside High School",
    "notation": false
  },
  "y10-english-transactional/exam-5-Edexcel-core": {
    "question": "Write a formal email to the customer services manager at EcoPack Supplies about a problem with a recent order. You ordered 60 insulated lunch bags under Order number 3921 for the charity fair next Friday. Only 45 arrived two days ago, leaving a shortfall of 15 bags and affecting the event plan. Delivery of the remaining bags was promised by 12:00 today, but they did not arrive. Explain what happened, describe the impact on the event, and clearly state what you want EcoPack to do (e.g., send the missing 15 bags or offer a refund). Use varied punctuation accurately; include at least three examples: semicolons, a colon, parentheses, dashes, and quotation marks where appropriate. The reply should be around 180-210 words.",
    "marks": 6,
    "markScheme": [
      "Uses a formal business-like structure with subject, greeting and sign-off appropriate to transactional writing",
      "Demonstrates accurate and varied punctuation (semicolon, colon, parentheses, dash, quotation marks) to control meaning and tone",
      "States clear order details (order number 3921, 60 bags; 45 arrived; shortfall of 15) and explains impact on the charity event",
      "Makes a clear request for remedy (replacement delivery or refund) and outlines required timescale or next steps",
      "Maintains a formal, respectful tone with correct grammar and tense throughout",
      "Uses clear paragraphing and accurate spelling to ensure overall clarity"
    ],
    "answer": "Subject: Missing bags from Order 3921\n\nDear Customer Services Manager,\n\nI am writing about Order 3921 for 60 insulated lunch bags, which we need for our charity fair next Friday. Only 45 bags arrived two days ago; the remaining 15 have still not been delivered. We were promised delivery of the missing items by 12:00 today, but that deadline has passed.\n\nThe shortfall has disrupted our preparations. We cannot complete the planned sets for the fair, and volunteers need time to check and arrange the remaining bags. Finding alternatives at short notice would also take time away from organising the event.\n\nPlease arrange delivery of the missing 15 bags before the fair, or refund the cost of those items if delivery is impossible. Our preference is straightforward: we would like the complete order in time for the event. Please confirm the proposed delivery date and any tracking details in writing.\n\nFor clarity, this request concerns the missing items only (15 bags); the 45 delivered bags have been received. I would appreciate a prompt response so that we can make reliable arrangements and inform the volunteers.\n\nThank you for your assistance.\n\nYours faithfully,\nDaniel Reed",
    "notation": false
  },
  "y10-english-transactional/exam-6-Edexcel-core": {
    "question": "You are a Year 10 student who has received a damaged item purchased online. Write two short emails that adapt tone to two audiences for the same situation: (a) an online retailer's customer service team (formal and polite), and (b) a friend (informal). Each email should be 90–120 words and should include: subject line, a greeting, a request for replacement or refund in email A, and a request for advice about that remedy in email B, a brief reason, and a courteous closing. Use specific details: order number AB12345, item: grey fleece hoodie, size M, arrived with a tear in the left sleeve, photos are attached.",
    "marks": 6,
    "markScheme": [
      "Email A uses a formal register appropriate for customer services.",
      "Email A provides a clear request for replacement or refund, with order number AB12345 and item details.",
      "Email A mentions attached photos and returns option with courteous closing.",
      "Email B uses an informal, conversational tone appropriate for a friend.",
      "Email B explains the issue succinctly, includes the order number and photos, and requests guidance.",
      "Email B closes in a friendly, relaxed way and keeps the message concise."
    ],
    "answer": "Subject: Request for replacement or refund — Order AB12345\n\nDear Customer Services Team,\n\n I am writing to report that the grey fleece hoodie I ordered (Order AB12345, size M) arrived with a tear in the left sleeve, as shown in the attached photos. Please could you arrange a replacement or a full refund as soon as possible. I would prefer a replacement in the same size and colour, if available, or a refund to the original payment method. I have included photos of the damage and the packaging. I can return the item using the provided returns label if required. Thank you for your prompt attention to this matter.\n\nYours faithfully,\nJamie Collins\n\nSubject: Quick update on the damaged hoodie from order AB12345\n\nHi Alex,\n\n You remember the grey fleece hoodie I ordered (Order AB12345)? It arrived today with a tear in the left sleeve. I’ve attached photos and I’ve emailed the online retailer asking for a replacement in the same size and colour or a refund to my card. I’ll keep the packaging until they confirm returns. I’m trying to stay calm and polite so they fix it quickly. Let me know if you think I should say anything differently, or if you’ve had success with online refunds lately.\n\nBest wishes,\nJamie Collins",
    "notation": false
  },
  "y10-english-transactional/exam-8-Edexcel-core": {
    "question": "You are a Year 10 student at Riverside High. Write an email to the head of the school library requesting that the library’s opening hours be extended on weekdays until 6:00 pm during term time to support revision for the mock exams. In your email, explain why the extension would benefit students, outline a practical plan (which days and times you propose), and include a clear call to action. Use rhetoric accurately: include at least three different devices (for example a rhetorical question, a rule of three, and anaphora or emotive language). The email should be formal in tone with a suitable subject line, greeting and sign-off. Aim for about 180–220 words.",
    "marks": 6,
    "markScheme": [
      "Formal transactional format: email/letter style with recipient, subject, greeting and closing.",
      "Clear request for a concrete action: extend library hours to 6:00 pm on weekdays during term time.",
      "Use of at least three rhetorical devices used accurately (e.g., rhetorical question, rule of three, anaphora, emotive language) integrated into the writing.",
      "Direct address and inclusive language to engage the reader.",
      "Concrete, practical plan: proposed days/times and rationale.",
      "Formal tone, proper punctuation, and coherent structure with clear opening, development and closing."
    ],
    "answer": "Subject: Request for extended library hours\n\nDear Head of Library,\n\nI am writing as a Year 10 student to request that the library remain open until 6:00 pm, Monday to Friday, during term time. With mock exams approaching, students would benefit from a reliable place to revise after lessons.\n\nWe need a quiet desk. We need access to books. We need time to work without interruptions. For students whose homes are crowded or noisy, these are practical needs, not luxuries. How can we make revision opportunities fairer if a suitable study space is unavailable after school?\n\nI propose an initial four-week trial of the weekday extension, followed by a review of attendance and staffing costs before deciding whether to continue throughout term time. The school could arrange appropriate adult supervision, publish clear behaviour expectations and ask students to register their interest. Staff availability and safe travel home would need consideration before the trial begins.\n\nThe extension would offer space, resources and reassurance. Please discuss the proposal with the headteacher and let the Student Council know whether a trial is feasible. We would be happy to gather students’ views and help explain the arrangements.\n\nThank you for considering this request.\n\nYours faithfully,\nAlex Carter",
    "notation": false
  },
  "y10-english-transactional/practice-9-AQA-core": {
    "question": "Write a formal letter of 190–210 words to the local council’s community events team seeking advice about any council permission needed for a proposed school charity bag-pack at a supermarket. Use a fictional Saturday date and venue. Explain the purpose, proposed time, adult supervision and safeguarding arrangements. Recognise that permission to use the store belongs to its management and do not assume a particular licence is required. Begin Dear Sir or Madam and end Yours faithfully followed by your name.",
    "hint": "Consider what a council officer will need to know to approve the request; present the key details clearly in a formal tone.",
    "working": [
      "Identify the council team as the audience for advice, and store management as the venue contact.",
      "Include purpose, fictional date and location, supervision and safe handling of donations.",
      "Ask what local requirements apply without asserting an unverified rule."
    ],
    "answer": "Dear Sir or Madam,\n\nI am a Year 10 pupil at Riverside High School, writing to request advice about a proposed charity bag-pack at Greenfield Supermarket on Saturday 12 June, from 10:00 am to 2:00 pm. The event would raise funds for our school’s community outreach programme, including support for the local food bank.\n\nWe will seek the store manager’s permission to use the supermarket space. Please advise whether any council permission or other local requirements would apply to the proposed collection. We would not advertise the event as confirmed until the relevant arrangements had been agreed.\n\nTwo school staff members would supervise pupils, with a named teacher responsible for the rota and contact details. The school would complete its risk assessment and safeguarding arrangements, obtain the necessary parental agreement and agree safe handling of donations. Participation by customers would be entirely voluntary, and we would keep entrances and aisles clear.\n\nPlease let us know which council team should review the proposal and what information it needs. We would welcome guidance before finalising plans with the supermarket, families and volunteers.\n\nThank you for your time and assistance. I look forward to your reply.\n\nYours faithfully,\nAlex Carter",
    "notation": false
  },
  "y10-geography-cartography-data-and-gis/exam-2-Edexcel-core": {
    "question": "A map grid with two rows and three columns represents a 3 km wide by 2 km high area of a fictional town. Each cell is 1 km^2. The population density values (people per square kilometre) for the six cells, listed from north-west to south-east, are: NW = 120; N-middle = 140; NE = 110; SW = 180; S-middle = 210; SE = 170. Using this data, write a clear, evidence-led conclusion about how population density varies across the grid. In your answer, identify which cell has the highest density and explain what the pattern suggests about the distribution of population in the town.",
    "marks": 4,
    "markScheme": [
      "Identifies the highest density value and its location (210 people/km^2 in the south-middle cell).",
      "Describes the north–south pattern, noting densities are higher in the southern row than in the northern row.",
      "Notes that within each row the middle cell has the highest density, showing a central peak.",
      "Provides a concise, evidence-led conclusion linking the data to the distribution of population in the town."
    ],
    "answer": "The highest density is 210 people per square kilometre in the south-middle cell (row 2, column 2). The densities in the northern row are 120, 140, and 110, while in the southern row they are 180, 210, and 170, showing that density is higher in the southern half of the grid. Within each row, the middle cell has the highest density (N-middle = 140; S-middle = 210), indicating a central peak in density within the grid. Overall, the pattern suggests a concentration of population toward the southern part of the town, especially in the south-middle cell, which may indicate a southern urban core.",
    "notation": false
  },
  "y10-geography-cartography-data-and-gis/practice-8-Edexcel-core": {
    "question": "In a fictional mapping exercise, the scale is 1:20,000. The shortest map distance from the town centre to the river is 7.0 cm; from the Springfield housing development it is 3.0 cm. A simplified exercise model treats locations within 1.5 km as potentially exposed and nearer locations as more exposed, holding all other factors equal. Calculate the distances, identify the more exposed area under this model, and state a limitation.",
    "hint": "Compare each distance from the river with the 1.5 km flood-risk threshold and note which is closer.",
    "working": [
      "7.0 cm × 200 m/cm = 1,400 m",
      "3.0 cm × 200 m/cm = 600 m",
      "1,400 m = 1.4 km",
      "600 m = 0.6 km",
      "0.6 km < 1.5 km and 1.4 km < 1.5 km; the 0.6 km distance is closer to the river, so the Springfield housing development is more at risk than the town centre."
    ],
    "answer": "The Springfield housing development is the area most at risk of flooding because it lies 0.6 km from the river (closer), while the town centre lies 1.4 km from the river; both distances are within the 1.5 km flood-risk threshold. This conclusion uses the simplified model only: real risk also depends on elevation, flood defences, drainage, river flow and building vulnerability.",
    "notation": false
  },
  "y10-geography-coasts-and-rivers/exam-8-AQA-core": {
    "question": "This is a fictional coastal-management scenario. Evaluate the effectiveness of two coastal-management strategies for a 25 km stretch of coastline at Seabrook Bay that is experiencing erosion and flood risk. Strategy A is a hard-engineering approach comprising a sea wall along the entire length (costing £180 million) and 12 groynes positioned every 2 km along the coast (costing £60 million). Strategy B is a soft-engineering approach comprising beach nourishment to maintain a 40 m wide beach (costing £120 million) and a policy of managed retreat for cliff-top properties (costing £25 million). The annual maintenance costs are £7 million for Strategy A and £4 million for Strategy B. Lifespans: sea wall 80 years; groynes 40 years; nourished beach cycles every 15–20 years. Evaluate the two strategies in terms of their ability to reduce flood risk and erosion, long-term economic costs, social impacts (including effects on tourism and property), and environmental considerations. Conclude which approach is more appropriate for Seabrook Bay given these data, or discuss whether a combination could be best.",
    "marks": 6,
    "markScheme": [
      "Strategy A provides strong, immediate protection for inland areas behind the sea wall.",
      "Strategy A can cause downdrift erosion and sediment transport changes due to groynes.",
      "Strategy A has high upfront costs but long lifespans and relatively predictable annual maintenance.",
      "Strategy B preserves a wide beach that supports tourism and can reduce risk through retreat, with less disruption to sediment transport.",
      "Strategy B has ongoing nourishment requirements and relocation costs, but lower upfront expenditure than Strategy A.",
      "Overall, a mixed or phased approach may be most appropriate, balancing protection of key areas with long-term sustainability, cost, and social/environmental impacts."
    ],
    "answer": "A costs £240 million initially (£180m + £60m), compared with £145 million for B (£120m + £25m). At unchanged prices, 80 years of stated maintenance adds £560 million for A and £320 million for B, giving £800 million and £465 million respectively before replacement or renourishment costs. These are not complete lifecycle totals: the groynes last 40 years, while nourishment recurs every 15–20 years, and replacement costs are not supplied. Inflation and discounting are also excluded.\n\nA can protect developed areas, but groynes can interrupt sediment movement and worsen downdrift erosion; a wall does not eliminate all flood risk. B maintains a beach that can absorb wave energy and support tourism, while retreat reduces exposure by relocating assets. Relocation can disrupt communities, and repeated nourishment has financial and ecological costs.\n\nI would investigate a mixed approach, protecting essential infrastructure while using nourishment and planned retreat where suitable. B has lower stated initial and annual costs, but the data cannot establish which option has the lowest full lifecycle cost or best benefit-to-cost ratio. Local sediment, flood-risk, property and community evidence is needed.",
    "notation": false
  },
  "y10-geography-coasts-and-rivers/practice-8-AQA-core": {
    "question": "For a fictional 2.0 km coastline, compare two separate strategies over 60 years. A sea wall costs £15 million initially and lasts throughout the period. Maintenance costs £0.5 million at years 10, 20, 30, 40, 50 and 60. Assume it reduces erosion along the protected stretch by 90%. Beach nourishment costs £6 million at years 0, 6, 12, 18, 24, 30, 36, 42, 48 and 54. It widens the beach by 12 m; no numerical erosion-reduction figure is supplied. Ignore inflation and discounting. Compare total costs and costs per metre, then discuss possible habitat, access and tourism effects.",
    "hint": "When comparing, consider both total cost over 60 years and qualitative effects on habitats and tourism.",
    "working": [
      "Sea-wall maintenance: 6 × £0.5 million = £3 million.",
      "Sea-wall total: £15 million + £3 million = £18 million; per metre: £18 million ÷ 2000 = £9000.",
      "Nourishment: 10 × £6 million = £60 million; per metre: £60 million ÷ 2000 = £30,000.",
      "The sea wall costs less under these assumptions and has a stated erosion reduction.",
      "Nourishment maintains a wider beach that may support recreation, but needs repeated work. Habitat and access effects need local assessment."
    ],
    "answer": "Sea wall: £18 million, or £9000 per metre. Nourishment: £60 million, or £30,000 per metre. The wall is cheaper under the stated schedule; nourishment may offer a wider recreational beach. The data do not give directly comparable erosion-reduction figures, so cost alone cannot settle overall effectiveness.",
    "notation": false
  },
  "y10-geography-natural-hazards/practice-1-Edexcel-core": {
    "question": "Compare Hurricane Katrina (USA, 2005) and Typhoon Haiyan (Philippines, 2013). Explain similarities in their physical causes, compare impacts, and discuss response and recovery. Evidence: the US National Weather Service reports 1,392 Katrina fatalities and US$125 billion damage in unadjusted 2005 dollars. The Philippine official Haiyan death count was 6,300; the World Bank reports an estimated US$12.9 billion in damage and losses for Haiyan. The cost definitions and years differ, so do not treat their ratio as a like-for-like comparison. Sources: weather.gov/lix/katrina_anniversary; pna.gov.ph/articles/1188062; World Bank, What Super Typhoon Yolanda in the Philippines told us about building back better (24 May 2018).",
    "hint": "Think about how location and governance affected the scale of impact and how responses differed.",
    "working": [
      "Both were tropical cyclones drawing energy from warm ocean water under suitable atmospheric conditions.",
      "Katrina caused severe Gulf Coast damage, including flooding associated with levee and floodwall failures around New Orleans. Haiyan brought destructive winds and storm surge in the Philippines.",
      "Compare the supplied fatality estimates, but distinguish damage from damage plus wider losses.",
      "Both required emergency relief and long-term reconstruction. The World Bank supported Philippine recovery and rebuilding; the supplied evidence does not measure which emergency response was faster.",
      "Explain that exposure, vulnerability, preparedness and infrastructure influence impacts alongside storm strength."
    ],
    "answer": "Both cyclones produced dangerous winds, storm surge and flooding, but their impacts reflected different exposure and vulnerability. The supplied estimates record more deaths for Haiyan: 6,300 compared with 1,392 for Katrina. Katrina caused US$125 billion in damage in 2005 dollars; Haiyan’s estimated US$12.9 billion covers damage and losses, so those values are not directly comparable. Both required emergency assistance and prolonged rebuilding. World Bank support for Philippine reconstruction illustrates international recovery assistance, but it does not prove that Haiyan’s evacuation or emergency aid was faster or more effective. A sound response comparison would also examine warning reach, evacuation access, shelter safety and delivery times.",
    "notation": false
  },
  "y10-geography-natural-hazards/practice-2-Edexcel-core": {
    "question": "This is a fictional teaching scenario. Evaluate the effectiveness of the evacuation, information campaigns and shelter provisions in response to Montara Island's volcanic eruption on 3 April 2025. Use the following data: at-risk population 28,000; 26,500 evacuated within 12 hours; 1,500 unable to evacuate due to access problems; 3 people died and 12 injured; 60 shelters with a combined capacity of 2,400; peak occupancy 2,000; information campaign reached 70% of households within 1 hour; 85% of evacuees reported understanding the guidance; airport closed for 48 hours; main road closures lasted 72 hours; total response cost £52 million; schools closed for 2 weeks; some businesses affected for 8 weeks.",
    "hint": "Consider both how many people were protected and how many remained at risk, plus social and economic costs.",
    "working": [
      "26,500 of 28,000 people were evacuated within 12 hours, about 94.6%; 1,500 remained unable to evacuate.",
      "Peak recorded shelter occupancy was 2,000 against 2,400 combined places. This shows spare capacity at the recorded peak, not accommodation for all 26,500 evacuees.",
      "70% of households received information within an hour; 85% of evacuees understood it. These percentages concern different groups.",
      "Road and airport closures and school and business disruption show substantial social and economic costs.",
      "Assess demonstrated reach and remaining gaps without claiming how many deaths were prevented."
    ],
    "answer": "The evacuation reached about 94.6% of the at-risk population within 12 hours, but access barriers left 1,500 people behind. The shelters had 400 spare places at their recorded peak; the data do not explain where the other evacuees stayed or establish that everyone had safe accommodation. Information reached 70% of households within an hour, and 85% of evacuees reported understanding it, showing useful but incomplete coverage. Three deaths and 12 injuries occurred; without a comparison scenario these figures do not measure lives saved. The £52 million cost and prolonged transport, school and business disruption also matter. Priorities for improvement are evacuation access, warning reach and checking accommodation for all displaced people.",
    "notation": false
  },
  "y10-geography-the-changing-economic-world/practice-5-AQA-core": {
    "question": "In a fictional region, a microfinance programme would offer small business loans, while a rural road programme would improve access to markets and services. Compare likely benefits and risks for living standards. Explain what evidence is needed before choosing between them, including how the benefits reach different groups and when they begin.",
    "hint": "Consider access, repayment risk, timing, distribution and continuing costs.",
    "working": [
      "Loans may help people invest in businesses, but repayment obligations and uncertain demand can create risks.",
      "Roads may improve access to markets, schools and healthcare, but construction takes time and maintenance costs continue.",
      "Benefits may reach different groups: households without viable businesses may gain little from loans, while remote communities may benefit from access.",
      "Compare reliable costs and benefits over the same time period, including maintenance and who receives income.",
      "A loan default rate does not directly establish which borrowers gained income; separate repayment evidence from livelihood outcomes."
    ],
    "answer": "Microfinance can support business investment but may expose borrowers to debt risk. Roads can improve access for a broader community but take time and require maintenance. A decision needs comparable costs, implementation dates, evidence of livelihood gains and distributional effects. Neither strategy is automatically best for every household.",
    "notation": false
  },
  "y10-geography-the-changing-economic-world/practice-9-Edexcel-core": {
    "question": "Two fictional countries have these development indicators: Country A has life expectancy 72 years, adult literacy 95% and GNI per person US$6,000; Country B has life expectancy 66 years, adult literacy 88% and GNI per person US$2,500. Compare what these indicators suggest about development. Explain two limitations of drawing a conclusion from them alone.",
    "hint": "Compare all three measures, then consider what averages and a small set of indicators leave out.",
    "working": [
      "A has higher life expectancy, literacy and GNI per person in this dataset.",
      "Together the measures suggest advantages in health outcomes, literacy and average income in A.",
      "National averages hide inequalities within each country.",
      "The measures do not describe every aspect of development, such as personal freedoms, environmental quality or access to particular services."
    ],
    "answer": "Country A has higher values for all three indicators: life expectancy is 6 years higher, literacy is 7 percentage points higher and GNI per person is US$3,500 higher. These suggest higher development on the measures supplied. However, national averages conceal inequalities, and these indicators omit other aspects of wellbeing and development. They are not enough to calculate the official Human Development Index.",
    "notation": false
  },
  "y10-geography-the-living-world/exam-0-AQA-core": {
    "question": "Explain how ecosystem links operate in a temperate deciduous forest, focusing on energy flow from producers to consumers and decomposers, and on nutrient cycling. Use the scenario of a decrease in leaf litter production to explain how changes in one part of the ecosystem could affect other parts.",
    "marks": 4,
    "markScheme": [
      "Energy flows from producers to consumers with energy lost as heat at each transfer; decomposers obtain energy from dead matter and recycle nutrients; energy is eventually dissipated to the surroundings.",
      "Nutrient cycling is maintained by decomposers breaking down leaf litter and dead organisms, returning nutrients to the soil for plant uptake.",
      "Ecosystem links show interdependence: producers support herbivores, herbivores support predators, and decomposers connect living matter with non-living matter through decay.",
      "A decrease in leaf litter would reduce the food available to decomposers, slow nutrient recycling, lower soil fertility, reduce plant growth, and cause cascading effects on herbivores and predators, potentially reducing biodiversity."
    ],
    "answer": "In a temperate deciduous forest, energy from sunlight is captured by producers (trees and shrubs) through photosynthesis and stored as chemical energy in their tissues. This energy moves through the ecosystem when organisms eat one another: primary consumers such as herbivorous insects and deer feed on plants; secondary consumers like birds and foxes eat primary consumers; and higher-level predators eat secondary consumers. Much of the energy that is not passed on is lost as heat through respiration and other metabolic processes, so only a small fraction moves from one trophic level to the next. Nutrient cycling is kept going by decomposers (bacteria and fungi) and detritivores (such as earthworms and woodlice) that break down leaf litter and dead organisms. As they decompose matter, nutrients (like minerals and elements such as nitrogen and phosphorus) are released back into the soil, where plants can absorb them again. This links the living parts of the forest with the non-living soil and recycling processes, sustaining plant growth and the whole food web. The links in the ecosystem are interdependent. Producers rely on nutrient availability and soil conditions to grow; herbivores rely on producers for energy; predators rely on herbivores for food; decomposers rely on dead material from all parts of the ecosystem. Because of this interconnection, changes in one part can affect many others. If leaf litter production decreases, there will be less detritus for decomposers and detritivores to feed on, slowing the decomposition process and nutrient release back to the soil. Soil fertility would decline, making it harder for producers to grow and replace the energy base of the ecosystem. With less food available, herbivores may become scarcer, which in turn can reduce the food available to predators. Over time, biodiversity could fall as some species decline or disappear. This example shows how ecosystem links—energy flow and nutrient cycling—are connected, and how a change in one component can cascade through the system.",
    "notation": false
  },
  "y10-geography-the-living-world/exam-2-AQA-core": {
    "question": "Use this fictional dataset for a hypothetical management programme in part of the Amazon. These figures are teaching assumptions, not verified statistics for the whole rainforest. Assess the sustainability and effectiveness of management strategies used in the Amazon rainforest to protect biodiversity and support local communities. Data: Protected areas cover 150,000 km2; 80,000 km2 are under community management with payments for ecosystem services funded by international donors. Ecotourism in three reserves attracts about 200,000 visitors per year and has generated around $25 million for local livelihoods in 2020–2023. Deforestation within protected areas has fallen by 40% since 2010–2014, while non-protected areas lose about 900 km2 of forest each year. Use these data to evaluate the extent to which sustainable management balances biodiversity conservation with local development. To what extent do these measures provide a sustainable model for the region?",
    "marks": 6,
    "markScheme": [
      "Identify how protected areas help to conserve biodiversity by restricting deforestation and habitat loss.",
      "Explain how community management (80,000 km2) and payments for ecosystem services can support local livelihoods and encourage conservation-led behaviour.",
      "Use the 40% reduction in deforestation within protected areas since 2010–14 to assess the effectiveness of protection in the designated zones.",
      "Discuss the role of ecotourism (about 200,000 visitors per year, $25 million over 2020–23) in providing income while potentially creating environmental pressures.",
      "Highlight the problem of ongoing forest loss (900 km2 per year) in non-protected areas and what this implies for overall biodiversity and planning.",
      "Conclude with a balanced judgement on sustainability, noting strengths in protected and community areas and weaknesses in non-protected zones and enforcement needs."
    ],
    "answer": "Within this hypothetical programme, protected areas cover 150,000 km² and deforestation within them has fallen by 40% relative to the stated baseline. This is consistent with conservation progress, but does not alone prove that designation caused the fall. Community management over 80,000 km² and payments for ecosystem services can connect conservation to local income; continued funding and fair participation matter. The areas may overlap, so they should not simply be added.\n\nEcotourism attracts 200,000 visitors per year in the three reserves and generated $25 million over 2020–2023. This offers a livelihood benefit, but distribution of that income and visitor impacts are unknown. The continuing loss of 900 km² per year outside protected areas shows that protection is incomplete. There are no equivalent baseline rates for a direct protected-versus-unprotected comparison. Overall, the programme has potential, but biodiversity monitoring, local benefit-sharing and durable funding are needed before judging it sustainable across the region.",
    "notation": false
  },
  "y10-geography-the-living-world/practice-8-AQA-core": {
    "question": "The following is a fictional dataset for a teaching exercise in part of the Brazilian Amazon; it is not a statement of verified regional totals. Assess the extent to which three sustainable management strategies in the Amazon rainforest in Brazil contribute to sustainable management: (i) protected areas (26 sites covering 120 000 km^2), (ii) selective logging with licensing affecting 2 500 km^2 in the last decade, and (iii) ecotourism generating $1.1 billion per year and supporting 75 000 local jobs. Use these figures to support your answer.",
    "hint": "Think about environmental, social and economic impacts and the trade‑offs between conserving biodiversity and supporting local livelihoods.",
    "working": [
      "Protected areas cover 120,000 km² in the scenario, but area alone does not establish effective enforcement.",
      "Selective logging affects 2,500 km² over a decade; this means removing selected trees, not necessarily clearing every tree from that area.",
      "The scenario assigns $1.1 billion annual tourism revenue and 75,000 jobs; assess who benefits and whether tourism damages habitats.",
      "Judge sustainability using ecological monitoring, local participation and whether timber harvesting allows regeneration."
    ],
    "answer": "The 26 protected sites covering 120,000 km² could conserve habitats if protection is enforced. Selective logging across 2,500 km² over a decade may retain more forest structure than clear-felling, but its sustainability depends on extraction rates and regeneration. The assumed $1.1 billion annual tourism revenue and 75,000 jobs suggest economic benefits; they do not show whether income reaches local communities fairly or whether visitor pressure harms habitats. These strategies therefore offer potential, but the supplied figures alone cannot establish long-term sustainability.",
    "notation": false
  },
  "y10-geography-urban-issues-and-challenges/exam-1-AQA-core": {
    "question": "Question 2 – Use place-specific evidence to explain why housing affordability is a challenge in Harford, a fictional UK city with two districts, North Harford and South Harford. The data below describe current housing conditions and a regeneration plan: North Harford has 8,200 households; private rent £1,100 per month; 28% of households spend more than 30% of income on housing; council housing 1,600 units; average weekly wage £520. South Harford has 5,400 households; private rent £950 per month; 34% of households spend more than 30% of income on housing; council housing 900 units; average weekly wage £480. The regeneration plan will reduce private rents by 10% in North Harford and by 5% in South Harford; it will increase council housing by 15% in North Harford and 25% in South Harford. Current council housing numbers are as stated above. Tasks: a) Calculate the new monthly private rents in each district after regeneration. b) Calculate the new number of council housing units in each district after regeneration. c) Convert weekly wages to monthly and calculate the private rent as a percentage of monthly income for each district before and after regeneration. d) Use place-specific evidence to explain one reason why housing affordability remains a challenge in Harford and provide a brief judgement on whether the regeneration plan will improve affordability for lower-income households.",
    "marks": 6,
    "markScheme": [
      "Uses place-specific data (rents, incomes, and proportions spending on housing) to identify an affordability issue in North and South Harford.",
      "Calculates current rent burden by converting weekly wages to monthly income and comparing with current monthly rents.",
      "Calculates post-regeneration private rents (North Harford: £990; South Harford: £902.50).",
      "Calculates post-regeneration council housing units (North Harford: 1,840; South Harford: 1,125).",
      "Explains one reason for affordability pressure using place-specific evidence (e.g., a high proportion of households spending more than 30% of income on housing; 34% in South Harford and 28% in North Harford).",
      "Evaluates whether regeneration will improve affordability for lower-income households, using the data to give a balanced judgement (rent reductions plus more council housing help, but remaining affordability challenges due to levels of rents relative to incomes)."
    ],
    "answer": "Using weekly wage × 52 ÷ 12, monthly incomes are £2,253.33 in North Harford and £2,080 in South Harford. Current private rent is about 48.8% and 45.7% of those incomes respectively. The planned rents are £990 and £902.50, about 43.9% and 43.4% of the same incomes. Council housing rises to 1,840 units in North Harford and 1,125 in South Harford. Affordability remains a concern: 28% and 34% of households already spend more than 30% of income on housing, and private rent remains a large share of the stated average wages after the changes. Lower rents and more council housing may help, but access, eligibility and household incomes vary. These wage-based comparisons are illustrative: average individual wages are not necessarily total household income, and no wage-growth trend is supplied.",
    "notation": false
  },
  "y10-geography-urban-issues-and-challenges/practice-3-AQA-core": {
    "question": "Riverdale is a fictional city that has grown quickly over the last decade. In 2010 its population was 520,000 and the city area was 280 km2. By 2020 the population had risen to 680,000 and the city area had expanded to 350 km2. Explain two possible factors that could have contributed to urban growth in Riverdale. Use the data provided to calculate the percentage increase in population from 2010 to 2020. Briefly explain how the change in city area might affect housing supply and services. State whether these data prove which causes operated.",
    "hint": "Use the population data to work out the percentage change with the formula (new − old) ÷ old × 100. Round to the nearest whole number.",
    "working": [
      "Step 1: Increase in population = 680,000 − 520,000 = 160,000.",
      "Step 2: Percentage increase = (160,000 ÷ 520,000) × 100 = 0.3077 × 100 = 30.8% ≈ 31%.",
      "Step 3: Area expansion = 350 − 280 = 70 km2.",
      "Step 4: A larger city area can provide space for more housing and facilities, but may lead to urban sprawl if transport and services are not planned."
    ],
    "answer": "Two possible causes are net inward migration and natural increase, where births exceed deaths. Jobs and services may attract migrants, but population totals alone do not establish either cause or its contribution; births, deaths, migration and boundary-change data would be needed. Population rose by 160,000, or about 30.8% (31% to the nearest whole percent). The city area increased by 70 km², which could provide room for housing and services but may also create longer journeys and infrastructure demands. The data show growth, not its precise causes.",
    "notation": false
  },
  "y10-geography-urban-issues-and-challenges/practice-4-AQA-core": {
    "question": "In fictional Limeford, two districts—Parkside and Riverside—have the following data: Parkside: population 9,600; area 2.4 km^2. Riverside: population 7,200; area 3.0 km^2. Using place-specific evidence, describe two urban pressures that could be more problematic in Parkside than in Riverside and explain how population density helps to account for these differences. Explain what additional evidence would be needed.",
    "hint": "Start by calculating the population densities of both districts.",
    "working": [
      "Step 1: Parkside density = 9,600 ÷ 2.4 = 4,000 people per km^2.",
      "Step 2: Riverside density = 7,200 ÷ 3.0 = 2,400 people per km^2.",
      "Step 3: Parkside has a higher density (4,000 people per km^2) than Riverside (2,400 people per km^2), which helps explain more crowded housing and greater demand for local services and transport in Parkside."
    ],
    "answer": "Parkside has 4,000 people per km², compared with 2,400 in Riverside. More people within a given area could increase demand for housing and pressure on transport or local services. However, density alone does not prove overcrowding or poor provision: high-density areas may have adequate housing, public transport and services. Compare people per room, housing costs, service capacity and transport use before concluding that these problems are worse in Parkside.",
    "notation": false
  },
  "y10-history-british-society-in-depth/practice-5-AQA-core": {
    "question": "How far do these two teaching summaries support the view that longer compulsory schooling necessarily gave girls equal educational opportunities in England? Summary A: The 1918 Education Act raised the school-leaving age to 14 and ended elementary-school fees, although implementation and exemptions require attention. Summary B: Legal access to school does not itself demonstrate equal subject choices, resources or expectations for girls and boys. These are modern teaching summaries, not quotations from contemporary documents. Use both and explain what additional evidence you would need.",
    "hint": "Distinguish a change in legal access from evidence of equal experience.",
    "working": [
      "A supports a change in the duration and affordability of elementary schooling.",
      "It does not say that 1918 first allowed girls to sit mathematics or science examinations.",
      "B identifies why longer attendance does not, by itself, prove equal opportunity.",
      "School records, curricula, examination entries and accounts from pupils would help assess differences in practice."
    ],
    "answer": "Summary A supports improved access through a higher leaving age and removal of elementary-school fees. However, it does not establish equality in subject choice, resources or expectations. Summary B therefore qualifies the claim: longer compulsory schooling could improve opportunity without making girls' and boys' experiences equal. To judge how far equality changed, I would compare school curricula, examination entries and pupils' accounts across dates and school types. These summaries alone cannot establish the position by 1970.",
    "notation": false
  },
  "y10-history-british-society-in-depth/practice-5-Edexcel-core": {
    "question": "How far was the creation of the NHS in 1948 the most significant change in British society between 1945 and 1951? Compare these original teaching summaries, use relevant knowledge and state your criterion for significance.\n\nA: The NHS made a broad range of healthcare available largely free at the point of use, reducing financial barriers to treatment.\n\nB: Post-war housing shortages and wider welfare reforms also affected everyday life; healthcare alone did not meet every social need.\n\nThese are modern teaching summaries, not historical quotations.",
    "hint": "Consider how free healthcare at the point of use, and housing/education reforms, affected ordinary people's daily lives.",
    "working": [
      "Choose a criterion, such as breadth of access or lasting effects on everyday life.",
      "Use A to explain why the NHS can be considered significant.",
      "Use B to compare housing and other welfare priorities.",
      "Reach a qualified judgement rather than treating one ranking as the only correct answer."
    ],
    "answer": "Using breadth of access and lasting influence as criteria, I would give the NHS great significance because it reduced financial barriers to a broad range of healthcare. However, B reminds us that housing and other welfare needs also shaped daily life. For a family without adequate housing, another reform might have had greater immediate importance. The NHS is therefore a defensible choice for the most significant change under my criteria, but the summaries alone do not establish an uncontested ranking.",
    "notation": false
  },
  "y10-history-british-society-in-depth/practice-8-Edexcel-core": {
    "question": "How far do you agree with the view that British society improved for ordinary people in the late 19th century? Use the following fictional teaching statements A and B and relevant historical knowledge. They are not quotations from archival documents. Source A: \"By the 1890s, education reforms had extended schooling to many children from working-class families, and laws limited the worst forms of child labour.\" Source B: \"Imagine a factory worker in 1888 describing rising rents and prices, meaning life remained hard even as some reforms were introduced.\"",
    "hint": "Consider whether reforms improved everyday life for all, or whether costs and housing limited the gains.",
    "working": [
      "Source A claims that education reforms extended schooling and limited the worst forms of child labour, indicating improvement for ordinary people.",
      "Source B notes rising rents and prices, showing that life remained hard despite reforms.",
      "Taken together, the sources suggest a mixed picture: some improvements occurred, but benefits were not universal.",
      "Therefore, the judgement is that the view is true to some extent."
    ],
    "answer": "There were improvements, but they were uneven. Education is one example: the 1870 Act expanded elementary provision, the 1880 Act made attendance compulsory for children aged 5–10, and the 1891 fee grant made most elementary schooling free. These developments support A's claim of wider access. B raises the possibility that living costs could limit the benefits, but an invented diary scenario cannot establish how common that experience was. Real wage, rent, housing and health evidence would be needed to judge changes for different groups.",
    "notation": false
  },
  "y10-history-change-across-time/exam-2-AQA-core": {
    "question": "In this fictional case study, a town uses hand looms throughout Period A. In Period B, factories rapidly adopt powered looms, but many small workshops still use hand looms. Compare the pace and extent of change in Periods A and B, using details from this scenario to support your judgement.",
    "marks": 3,
    "markScheme": [
      "Production methods change more rapidly in Period B because factories adopt powered looms.",
      "Hand looms continue in small workshops, so change is uneven and does not affect every worker at once.",
      "This distinguishes the speed of change from how widely it affected people."
    ],
    "answer": "Production methods change more rapidly in Period B because factories adopt powered looms. Hand looms continue in small workshops, so change is uneven and does not affect every worker at once. This distinguishes the speed of change from how widely it affected people.",
    "notation": false
  },
  "y10-history-change-across-time/exam-2-Edexcel-core": {
    "question": "In this fictional case study, travel in a region depends on roads and canals throughout Period A. During Period B a railway opens and connects several towns, while remote villages continue to rely on carts. Compare the pace and extent of change in Periods A and B, using details from this scenario to support your judgement.",
    "marks": 3,
    "markScheme": [
      "Transport changes more rapidly in Period B as the railway provides a new connection between towns.",
      "Remote villages retain older transport, so continuity exists alongside change.",
      "This distinguishes the speed of change from how widely it affected people."
    ],
    "answer": "Transport changes more rapidly in Period B as the railway provides a new connection between towns. Remote villages retain older transport, so continuity exists alongside change. This distinguishes the speed of change from how widely it affected people.",
    "notation": false
  },
  "y10-history-change-across-time/exam-8-AQA-core": {
    "question": "In this fictional case study, travel in a region depends on roads and canals throughout Period A. During Period B a railway opens and connects several towns, while remote villages continue to rely on carts. Compare the pace and extent of change in Periods A and B, using details from this scenario to support your judgement.",
    "marks": 3,
    "markScheme": [
      "Transport changes more rapidly in Period B as the railway provides a new connection between towns.",
      "Remote villages retain older transport, so continuity exists alongside change.",
      "This distinguishes the speed of change from how widely it affected people."
    ],
    "answer": "Transport changes more rapidly in Period B as the railway provides a new connection between towns. Remote villages retain older transport, so continuity exists alongside change. This distinguishes the speed of change from how widely it affected people.",
    "notation": false
  },
  "y10-history-change-across-time/exam-8-Edexcel-core": {
    "question": "In this fictional case study, access to schooling changes little during Period A. In Period B new schools open in towns, but children in remote villages still have limited access. Compare the pace and extent of change in Periods A and B, using details from this scenario to support your judgement.",
    "marks": 3,
    "markScheme": [
      "School provision changes more rapidly in Period B because new schools open in towns.",
      "Access remains limited in remote villages, showing that change is geographically uneven.",
      "This distinguishes the speed of change from how widely it affected people."
    ],
    "answer": "School provision changes more rapidly in Period B because new schools open in towns. Access remains limited in remote villages, showing that change is geographically uneven. This distinguishes the speed of change from how widely it affected people.",
    "notation": false
  },
  "y10-history-change-across-time/practice-2-AQA-core": {
    "question": "In this fictional case study, access to schooling changes little during Period A. In Period B new schools open in towns, but children in remote villages still have limited access. Compare the pace and extent of change in Periods A and B, using details from this scenario to support your judgement.",
    "hint": "Compare what changed, how quickly it changed and what continued.",
    "working": [
      "School provision changes more rapidly in Period B because new schools open in towns.",
      "Access remains limited in remote villages, showing that change is geographically uneven.",
      "This distinguishes the speed of change from how widely it affected people."
    ],
    "answer": "School provision changes more rapidly in Period B because new schools open in towns. Access remains limited in remote villages, showing that change is geographically uneven. This distinguishes the speed of change from how widely it affected people.",
    "notation": false
  },
  "y10-history-change-across-time/practice-2-Edexcel-core": {
    "question": "In this fictional case study, a town council makes small improvements to drains over several decades in Period A. After a health crisis in Period B it quickly builds a connected sewer network, while isolated houses remain unconnected. Compare the pace and extent of change in Periods A and B, using details from this scenario to support your judgement.",
    "hint": "Compare what changed, how quickly it changed and what continued.",
    "working": [
      "Sanitation changes more rapidly in Period B because a connected sewer network replaces gradual improvements.",
      "Isolated houses remain unconnected, showing that the extent of change is limited despite its faster pace.",
      "This distinguishes the speed of change from how widely it affected people."
    ],
    "answer": "Sanitation changes more rapidly in Period B because a connected sewer network replaces gradual improvements. Isolated houses remain unconnected, showing that the extent of change is limited despite its faster pace. This distinguishes the speed of change from how widely it affected people.",
    "notation": false
  },
  "y10-history-change-across-time/practice-3-AQA-core": {
    "question": "Place these events in chronological order from oldest to most recent, using the dates provided: 1066 AD – The Norman Conquest of England; 1215 AD – The sealing of Magna Carta; c.1450 AD – Gutenberg develops printing with movable metal type in Europe; 1688 AD – The Glorious Revolution in England.",
    "hint": "Think about which event happened first by looking at the years.",
    "working": [
      "Identify the dates for each event: 1066 AD; 1215 AD; c.1450 AD; 1688 AD.",
      "The earliest date is 1066 AD, so that event goes first.",
      "The next date is 1215 AD, so that event goes second.",
      "Among c.1450 AD and 1688 AD, c.1450 AD is earlier, so it goes third; 1688 AD last."
    ],
    "answer": "1066 AD; 1215 AD; c.1450 AD; 1688 AD",
    "notation": false
  },
  "y10-history-change-across-time/practice-5-AQA-core": {
    "question": "In this fictional case study, a town council makes small improvements to drains over several decades in Period A. After a health crisis in Period B it quickly builds a connected sewer network, while isolated houses remain unconnected. Compare the pace and extent of change in Periods A and B, using details from this scenario to support your judgement.",
    "hint": "Compare what changed, how quickly it changed and what continued.",
    "working": [
      "Sanitation changes more rapidly in Period B because a connected sewer network replaces gradual improvements.",
      "Isolated houses remain unconnected, showing that the extent of change is limited despite its faster pace.",
      "This distinguishes the speed of change from how widely it affected people."
    ],
    "answer": "Sanitation changes more rapidly in Period B because a connected sewer network replaces gradual improvements. Isolated houses remain unconnected, showing that the extent of change is limited despite its faster pace. This distinguishes the speed of change from how widely it affected people.",
    "notation": false
  },
  "y10-history-change-across-time/practice-5-Edexcel-core": {
    "question": "In this fictional case study, a region relies on a few handwritten newsletters during Period A. Printing shops open rapidly in Period B, but reading material remains costly for poor families. Compare the pace and extent of change in Periods A and B, using details from this scenario to support your judgement.",
    "hint": "Compare what changed, how quickly it changed and what continued.",
    "working": [
      "Access to printed material changes more rapidly in Period B as printing shops open.",
      "Cost continues to restrict access for poor families, so faster change does not mean equal benefits.",
      "This distinguishes the speed of change from how widely it affected people."
    ],
    "answer": "Access to printed material changes more rapidly in Period B as printing shops open. Cost continues to restrict access for poor families, so faster change does not mean equal benefits. This distinguishes the speed of change from how widely it affected people.",
    "notation": false
  },
  "y10-history-change-across-time/practice-8-AQA-core": {
    "question": "In this fictional case study, a region relies on a few handwritten newsletters during Period A. Printing shops open rapidly in Period B, but reading material remains costly for poor families. Compare the pace and extent of change in Periods A and B, using details from this scenario to support your judgement.",
    "hint": "Compare what changed, how quickly it changed and what continued.",
    "working": [
      "Access to printed material changes more rapidly in Period B as printing shops open.",
      "Cost continues to restrict access for poor families, so faster change does not mean equal benefits.",
      "This distinguishes the speed of change from how widely it affected people."
    ],
    "answer": "Access to printed material changes more rapidly in Period B as printing shops open. Cost continues to restrict access for poor families, so faster change does not mean equal benefits. This distinguishes the speed of change from how widely it affected people.",
    "notation": false
  },
  "y10-history-change-across-time/practice-8-Edexcel-core": {
    "question": "In this fictional case study, a town uses hand looms throughout Period A. In Period B, factories rapidly adopt powered looms, but many small workshops still use hand looms. Compare the pace and extent of change in Periods A and B, using details from this scenario to support your judgement.",
    "hint": "Compare what changed, how quickly it changed and what continued.",
    "working": [
      "Production methods change more rapidly in Period B because factories adopt powered looms.",
      "Hand looms continue in small workshops, so change is uneven and does not affect every worker at once.",
      "This distinguishes the speed of change from how widely it affected people."
    ],
    "answer": "Production methods change more rapidly in Period B because factories adopt powered looms. Hand looms continue in small workshops, so change is uneven and does not affect every worker at once. This distinguishes the speed of change from how widely it affected people.",
    "notation": false
  },
  "y10-history-historical-interpretations/practice-0-Edexcel-core": {
    "question": "Read two original teaching interpretations of the outbreak of the First World War. Identify each interpretation's main argument and explain how its wording reveals the emphasis.\n\nInterpretation 1: Long-term competition between powers, including imperial rivalry and military planning, made a European war more likely before 1914.\n\nInterpretation 2: War was not inevitable. Decisions made by governments during the crisis following the assassination at Sarajevo turned a regional dispute into a wider conflict.",
    "hint": "Look for whether each source blames long-term trends or immediate events for the war.",
    "working": [
      "Interpretation 1 stresses pressures that developed before 1914.",
      "Interpretation 2 stresses government decisions during the immediate crisis.",
      "The words “more likely” differ from “inevitable”: the two accounts emphasise different levels of explanation without requiring every claim in the other to be false."
    ],
    "answer": "Interpretation 1 emphasises long-term conditions: “imperial rivalry and military planning” made war “more likely”. Interpretation 2 emphasises immediate decisions after Sarajevo and rejects inevitability. One explains the background pressures; the other explains how choices during the crisis produced escalation. These are teaching interpretations rather than quotations attributed to named historians.",
    "notation": false
  },
  "y10-history-historical-interpretations/practice-1-Edexcel-core": {
    "question": "Compare these two original teaching interpretations of the Glorious Revolution of 1688. Explain two differences in emphasis; do not invent evidence the statements do not mention.\n\nA: Religious fears were central. James II's Catholicism and policies alarmed opponents who feared a lasting Catholic dynasty.\n\nB: Political authority was central. Opposition grew because James II's use of royal power threatened established institutions; influential political leaders invited William of Orange to intervene.",
    "hint": "Compare the central concern and the actors or developments each interpretation emphasises.",
    "working": [
      "A makes religious fears central; B makes the exercise of royal power central.",
      "A highlights fear of a continuing dynasty; B highlights the action of political opponents inviting intervention.",
      "Religious and political concerns could overlap, so different emphasis need not mean total disagreement."
    ],
    "answer": "First, A prioritises religion, whereas B prioritises royal authority and institutions. Second, A emphasises anxiety about a continuing Catholic dynasty, while B stresses the active decision by political opponents to invite William. The statements do not identify which documents their writers used, so we cannot claim different source bases from this text alone.",
    "notation": false
  },
  "y10-history-historical-interpretations/practice-6-Edexcel-core": {
    "question": "Read two fictional teaching interpretations of the rapid spread of the Black Death in England from 1348. A argues: “Crowded living conditions helped disease spread within settlements.” B argues: “Trade and travel connected settlements, carrying disease across wider areas.” Identify each argument and explain which better addresses geographical spread between towns. Explain why these statements alone cannot establish the full causes of transmission.",
    "hint": "Look at what each extract says is the main reason.",
    "working": [
      "A focuses on conditions within settlements.",
      "B focuses on connections between settlements.",
      "B more directly addresses spread between towns, but that does not disprove A.",
      "Neither statement supplies enough evidence to establish all transmission mechanisms or their relative importance."
    ],
    "answer": "A emphasises local living conditions; B emphasises movement between places. B more directly explains geographical spread between towns because travel links separate populations. The factors could interact, however, and the statements provide no evidence with which to test disease mechanisms or rank their overall importance. They are teaching arguments, not authenticated quotations from historians.",
    "notation": false
  },
  "y10-history-historical-sources/exam-8-AQA-core": {
    "question": "Fictional source-analysis exercise: the following wording, people and publication details are invented for teaching. They are not authenticated primary sources. Analyse how the stated content and provenance would affect usefulness if you encountered such documents, then explain why these fictional extracts cannot establish historical events.\n\nStudy Sources A and B. Source A is a government pamphlet published in August 1914, 'Britain's Duty and the War.' It states: \"It is our duty to protect the Empire and to stand by our friends in Europe. War is necessary to defend freedom and keep trade safe.\" Source B is a diary entry by a London factory worker written in September 1914, which records: \"People are frightened, but they talk of duty. We hear the Government promises and the soldiers' songs, yet we fear what the future holds: shortages, bombardments, and long years of hardship.\" Using these sources, reach a balanced judgement about how useful these sources are for investigating why Britain joined the First World War in 1914.",
    "marks": 6,
    "markScheme": [
      "Source A provides clear evidence of the government's stated reasons and motivation to go to war, showing the official narrative.",
      "It is useful for understanding the aims the government wanted to project to the public.",
      "However, Source A is biased and written to persuade support for war; it may not reveal the full range of reasons Britain joined.",
      "Source B offers a personal, contemporary perspective showing how some people felt about the war and their sense of duty, plus fears about hardship.",
      "It is useful for showing civilian reaction and the emotional context in early war.",
      "Explains that these are fictional teaching texts; real historical conclusions require authenticated sources and corroboration."
    ],
    "answer": "Both sources are useful but for different aspects. Source A helps explain the official rationale and aims used to persuade the public to support war (defend the Empire, defend freedom, keep trade). Its bias and purpose limit its ability to reveal the full range of reasons Britain joined. Source B provides insight into civilian reaction, feelings of duty, and awareness of hardship, which helps understand public sentiment at the time, but as a single diary it may not represent all groups and it does not state the political or strategic reasons behind the decision. Taken together, they offer a partial view: they show the official justification and immediate public response, but to explain why Britain actually joined the war more completely, other sources (e.g., parliamentary debates, other contemporary accounts) would be needed. These invented texts practise the method of source analysis. Establishing actual historical attitudes requires authenticated documents and wider contextual evidence.",
    "notation": false
  },
  "y10-history-historical-sources/exam-8-Edexcel-core": {
    "question": "Fictional source-analysis exercise: the following wording, people and publication details are invented for teaching. They are not authenticated primary sources. Analyse how the stated content and provenance would affect usefulness if you encountered such documents, then explain why these fictional extracts cannot establish historical events.\n\nUse Sources A–C to reach a balanced judgement about how useful these sources are for studying attitudes to factory reform in Britain in the 1830s. The sources are as follows: Source A: A diary entry written by a factory owner in 1833. \"The machines have brought wealth to our town; profits rise and trade flourishes.\" Source B: A government report on factory conditions from 1833. \"These conditions are harsh; long hours and dangerous machinery; reform is necessary.\" Source C: A letter from a factory worker in 1833. \"We work from dawn to dusk; the hours must be shorter, and wages must rise.\" Using these sources, discuss how useful they are for studying attitudes to reform. In your answer, refer to the content, purpose, and potential biases of each source, and reach a balanced judgement about their overall usefulness.",
    "marks": 6,
    "markScheme": [
      "Identify Source A as a diary entry from a factory owner, showing a business bias and a perspective that may downplay reform.",
      "Identify Source B as an official government report, credible for facts about conditions but potentially framed to justify policy or reform.",
      "Identify Source C as a worker’s letter, giving lived experience and emotional perspective but not necessarily representative.",
      "Note that all sources come from 1833, placing them in the early reform era and helping with context, but limiting scope to that moment.",
      "Explain how using the three sources together gives a more balanced picture (A shows incentives, B shows policy need, C shows daily impact), though each has limits.",
      "Explains that these are fictional teaching texts; real historical conclusions require authenticated sources and corroboration."
    ],
    "answer": "Source A is from a factory owner and shows a clear business perspective; it argues that machines and profits prove the system works and implies reform could threaten economic growth. This makes Source A useful for understanding attitudes that oppose reform or resist change, but its bias towards business means it cannot reliably reveal how ordinary people felt about reform. Source B is an official government report, which makes it a credible source for describing what conditions were like and why reform was considered necessary. Its purpose is to justify policy, so it is valuable for understanding the political support for reform, though it may present the situation in a way that supports government action. Source C is a worker’s letter describing long hours and the desire for shorter hours and higher wages; it offers direct, lived experience and shows personal attitudes toward reform. However, as a single personal account, it may not represent all workers’ views. Taken together, Sources A, B and C provide a useful, varied set that helps build a balanced view of attitudes to reform in the 1830s, but the picture is partial; more sources (such as debates or legislation) would give a fuller understanding. These invented texts practise the method of source analysis. Establishing actual historical attitudes requires authenticated documents and wider contextual evidence.",
    "notation": false
  },
  "y10-history-historical-sources/exam-9-AQA-core": {
    "question": "Fictional source-analysis exercise: the following wording, people and publication details are invented for teaching. They are not authenticated primary sources. Analyse how the stated content and provenance would affect usefulness if you encountered such documents, then explain why these fictional extracts cannot establish historical events.\n\nSource A is a short excerpt from a pamphlet published in 1842 by the United Factory Owners' Association, aimed at factory owners and Members of Parliament to persuade them to oppose factory reform. Excerpt: “To empower Parliament to dictate the hours of labour is to strike at the very root of commerce. The freedom to hire and fire is the first pillar of a thriving town. Only by maintaining practical limits can we keep workers employed and prices stable.” Using Source A, assess how useful it is for studying attitudes to factory reform in Britain, 1833-1844, with reference to its provenance.",
    "marks": 6,
    "markScheme": [
      "It is presented in the exercise as a source from 1842, which places it in the period and gives contemporary insight.",
      "The provenance shows it comes from a factory owners’ association, indicating a clear bias in favour of business interests.",
      "The intended audience (factory owners and MPs) suggests the pamphlet aims to influence policy, which affects how useful it is for understanding wider public attitudes.",
      "The emotive language emphasizes concerns about property and employment, revealing what worries the authors, but potentially exaggerating risks.",
      "It omits workers’ perspectives, limiting its usefulness as a sole source for attitudes across society.",
      "Explains that these are fictional teaching texts; real historical conclusions require authenticated sources and corroboration."
    ],
    "answer": "Source A, as a simulated contemporary document, provides useful insight into the viewpoint of factory owners during the Reform debates of 1833-1844. Its provenance—published in 1842 by the United Factory Owners' Association and aimed at factory owners and MPs—clearly signals a bias toward business interests, which is crucial for interpreting its evidence. The fact that the pamphlet is trying to persuade its audience means historians must weigh its claims carefully against other sources that might present workers’ experiences or reformist arguments. The language is emotive and framed around property rights and employment stability, showing the kinds of concerns held by those opposing reform; however, this rhetoric may overstate dangers and should be cross-checked with other sources. A notable limitation is that the pamphlet does not include workers’ voices, so it provides a partial view of attitudes and should be used alongside sources that reflect labourers, such as factory reports or workers’ testimonies. Its date and purpose place it within the period’s debates, making it valuable for understanding the timing and political context; comparing it with other sources from 1833-1844 can give a fuller picture of attitudes toward reform across society. Overall, Source A is useful for understanding employer opposition and the political dimension of reform, but it must be treated as one perspective among several to accurately gauge broader attitudes. These invented texts practise the method of source analysis. Establishing actual historical attitudes requires authenticated documents and wider contextual evidence.",
    "notation": false
  },
  "y10-history-historical-sources/exam-9-Edexcel-core": {
    "question": "Fictional source-analysis exercise: the following wording, people and publication details are invented for teaching. They are not authenticated primary sources. Analyse how the stated content and provenance would affect usefulness if you encountered such documents, then explain why these fictional extracts cannot establish historical events.\n\n10 Assess the usefulness of Source A for an enquiry into civilian life in Britain during the Blitz, using provenance. Source A is a diary entry written in 1940 by Ida Green, a 30-year-old housewife living in Birmingham, describing her daily life during the Blitz. It was published in the Birmingham Daily News in January 1941. An excerpt from Source A reads: “We queued for bread before dawn; the sirens started; we moved to the shelter and listened to the radio while the street lamps were out.”",
    "marks": 6,
    "markScheme": [
      "The source is a diary written by a private individual (a Birmingham housewife) in 1940, giving a personal, domestic view of civilian life.",
      "Its publication in a local newspaper in 1941 means it was edited for public consumption, which affects its reliability as an exact, first-hand record.",
      "The Birmingham urban setting provides useful insight into city life, such as queues, shortages, and air raids, but may not represent rural areas or other cities.",
      "The date (1940) places the content in the early Blitz, so its usefulness is tied to that specific period rather than later phases of the war.",
      "The diary form yields detailed daily routines and personal feelings, offering colour and context, but it is subjective and not a representative sample of all civilians.",
      "Explains that these are fictional teaching texts; real historical conclusions require authenticated sources and corroboration."
    ],
    "answer": "Source A is useful for understanding what life looked like for at least one urban, civilian family during the early Blitz, because it comes from a private diary written by Ida Green in 1940 and focuses on daily routines such as food queues, air raids, and the blackout. Its provenance—written by a fictional person in Birmingham—provides a vivid, everyday perspective that helps us feel what it was like to live through those events. However, its publication in a local newspaper in January 1941 means editors may have edited or selected content to fit public aims, so it is not a complete or neutral record and may reflect moments chosen for impact rather than typical experiences. The urban Birmingham setting offers useful detail about city life, but the source may not represent rural areas or other towns. Because the diary is a personal account, it conveys personal feelings and specific circumstances rather than broad patterns across the whole country. The date places the diary in the early phase of the Blitz, so its details may not apply to later stages of the war. Overall, Source A is valuable for depth and immediacy about one family’s experiences, but it should be used alongside other sources to build a fuller, more representative picture of civilian life during the Blitz. These invented texts practise the method of source analysis. Establishing actual historical attitudes requires authenticated documents and wider contextual evidence.",
    "notation": false
  },
  "y10-history-historical-sources/practice-9-Edexcel-core": {
    "question": "Fictional source-analysis exercise: the following wording, people and publication details are invented for teaching. They are not authenticated primary sources. Analyse how the stated content and provenance would affect usefulness if you encountered such documents, then explain why these fictional extracts cannot establish historical events.\n\nAnalyse provenance and content using the following source from a war-time letter. Source A: Excerpt dated 1940, written by May Clarke, a factory worker in Birmingham, addressed to her sister Ada. Dear Ada, the shelves were almost empty again this morning. The sugar ration is still not enough, and I had to boil the tea with barley water. We managed to save a little flour by trading with Mrs Patel, but there is talk of more shortages ahead. Still, we must carry on for the war effort, for the men overseas and for our country. Using this source, explain: (i) provenance – who wrote it, when and why, and who it was for; (ii) content – what the letter tells you about rationing and attitudes to the war effort; (iii) evaluate how useful this source is for understanding ordinary people’s experiences of rationing in wartime and identify any limitations.",
    "hint": "Think about who wrote it, who they were writing to, and the context of 1940.",
    "working": [
      "Step 1 – Provenance: The author is May Clarke, a factory worker in Birmingham, writing in 1940, and the recipient is her sister Ada.",
      "Step 2 – Purpose and audience: It is a personal update to a family member, not a public document, suggesting it is meant for close family understanding.",
      "Step 3 – Content: It describes shortages (sugar), substitution (barley water for tea), and a trading action (flour with Mrs Patel), showing everyday coping and support for the war effort.",
      "Step 4 – Reliability: As a single personal letter, it gives one person’s perspective and feelings, which may not represent everyone’s experience.",
      "Step 5 – Usefulness and limitations: Useful for understanding daily life and attitudes to rationing, but limited by being a private, not representative, view; should be compared with other sources for a fuller picture.",
      "Separate the hypothetical provenance analysis from claims about real people: this source is invented for the exercise."
    ],
    "answer": "This source is useful for understanding how ordinary people experienced rationing and supported the war effort in daily life, but it is limited because it reflects only one person’s viewpoint and circumstances. To gain a fuller picture of wartime rationing, it should be compared with additional sources such as official records or other letters. These invented texts practise the method of source analysis. Establishing actual historical attitudes requires authenticated documents and wider contextual evidence.",
    "notation": false
  },
  "y10-history-international-period-study/practice-7-Edexcel-core": {
    "question": "Analyse the significance of the League of Nations in shaping international relations in the 1920s and 1930s. In your answer, discuss (i) how it tried to resolve disputes in the 1920s with one example, and (ii) how its actions or inactions during two major crises in the 1930s—Manchuria (1931–32) and Abyssinia (1935–36)—affected its credibility.",
    "hint": "Think about the difference between successful mediation of small disputes and the League's failures to stop bigger aggressions.",
    "working": [
      "Step 1: The question asks you to analyse significance by weighing both successes and failures across two decades.",
      "Step 2: In the 1920s the League attempted dispute resolution, for example the Aaland Islands dispute of 1921, showing its mediation role.",
      "Step 3: In the Manchuria crisis (1931–32) the League condemned the aggression but had limited enforcement power, and Japan withdrew from the League in 1933.",
      "Step 4: In Abyssinia (1935–36) the League imposed sanctions, but they were incomplete and Italy defied the League, leading to its withdrawal in 1937.",
      "Step 5: Therefore, the League's significance lies in promoting ideas of collective security and international law, but its credibility was weakened by weak enforcement, limited powers, and the absence of major powers."
    ],
    "answer": "The League helped resolve the Åland Islands dispute in 1921, showing a capacity for peaceful arbitration. In Manchuria, investigation and condemnation did not reverse Japan’s occupation, and Japan left the League. During the Abyssinia crisis, sanctions failed to stop Italy’s conquest. These cases suggest some success where states accepted mediation, but weak enforcement when major powers resisted collective action.",
    "notation": false
  },
  "y10-history-site-and-context/exam-0-AQA-core": {
    "question": "Read the following fictional teaching description of two artefacts found at the site of a former airfield in England during the Second World War. Item A is a circular brass badge, 4.0 cm in diameter, showing a crown above a shield with the letters ARP around the edge; the back has a pin and the rim is stamped with the date 1941. Item B is a wooden sign fragment, 20.0 cm long, painted pale blue with white lettering reading \"Air Raid Precautions Wardens\" and a small helmet symbol; the fragment has chipped ends suggesting it came from a larger sign. Using these artefacts, explain two different ways in which they show the site was used during the war and what they reveal about dating the site. You should base your answer only on the artefacts described.",
    "marks": 4,
    "markScheme": [
      "1 mark: links ARP lettering to civil defence.",
      "1 mark: uses the warden sign to suggest an organised warden presence or activity.",
      "1 mark: identifies the 1941 stamp as evidence about the badge's date.",
      "1 mark: explains that deposition, later movement and the undated sign limit precise dating of site use."
    ],
    "answer": "The ARP badge suggests a connection with civil defence personnel, while the sign naming wardens suggests organised activity or a designated warden location. The 1941 stamp dates the badge or its marking; if its context is secure, it can provide an earliest possible date for the deposit containing it. It does not independently date the sign or prove that both were used at the site in 1941–1942. Context and evidence of later movement would need checking.",
    "notation": false
  },
  "y10-history-site-and-context/exam-5-AQA-core": {
    "question": "In this fictional teaching case, Blackstone Hill Fort is a hill-fort dating to the Iron Age, located on a hill overlooking the River Alder. The enclosed area covers about 2 hectares. Defensive works include three earth ramparts up to 2.5 metres high, with a single entrance about 1.8 metres wide. Inside the enclosure there are several hearth pits and domestic pottery sherds, suggesting everyday living within the site. A small number of artefacts include a bronze bead from a distant coastal area, indicating long-distance trade. There is evidence of spaces used seasonally and a raised platform that may have served ritual use. Archaeologists vary in interpretation: some think the fort controlled movement along a local trade route; others argue it was a place of refuge during periods of conflict. Assess the significance of Blackstone Hill Fort as a site for understanding Iron Age social, economic and political life in this region.",
    "marks": 6,
    "markScheme": [
      "1 mark: links hearths and pottery to domestic activity.",
      "1 mark: explains how ramparts and a narrow entrance support a defensive interpretation.",
      "1 mark: links the distant-origin bead to possible exchange or movement of people.",
      "1 mark: explains the potential strategic relevance of the river location.",
      "1 mark: treats the platform's ritual function as a hypothesis requiring further evidence.",
      "1 mark: reaches a qualified judgement recognising multiple uses and evidential limits."
    ],
    "answer": "The hearths and domestic pottery suggest everyday occupation, but do not establish a population total. Ramparts and a narrow entrance support a defensive role and imply organised labour. The bead suggests connections beyond the local area through exchange or movement of people; it does not alone prove the route or form of trade. Overlooking the river could have offered strategic advantages, although control of a trade route remains an interpretation. The platform's ritual use is also uncertain. The site is useful for exploring social organisation and several possible functions, rather than proving one fixed purpose.",
    "notation": false
  },
  "y10-history-site-and-context/practice-9-Edexcel-core": {
    "question": "Read the following description of a fragment of stone from a doorway at a medieval church site. Using only this information, explain two conclusions about how the site was used in the medieval period. The fragment is 60.0 cm long, 25.0 cm wide and 4.5 cm thick. One long edge shows a shallow groove 0.8 cm wide and 0.4 cm deep running the full 60.0 cm length. The opposite long edge bears wear along the bottom edge of about 3.0 cm high. On the surface there is a patch of red ochre pigment measuring 12.0 cm by 8.0 cm. There are five hammer marks, each about 1.2 cm across, spaced 12.0 cm apart along the length.",
    "hint": "Think about what each feature says about use and meaning at the doorway.",
    "working": [
      "Wear on a doorway stone is consistent with repeated use, although its original position needs confirmation.",
      "Red ochre shows that pigment was applied; its purpose might have been decorative, protective or symbolic.",
      "Hammer marks show working of the stone, but do not establish where or when that work occurred."
    ],
    "answer": "One tentative conclusion is that the doorway saw repeated use, supported by the worn edge, if the fragment was found in its original position. A second is that part of the stone was coloured, because red ochre survives. The pigment alone cannot prove ritual use, and hammer marks cannot prove the stone was worked on this site. Wider archaeological context is needed to test those interpretations.",
    "notation": false
  },
  "y10-maths-algebra/exam-2-AQA-Foundation": {
    "question": "A rectangle has width $x$ metres and length $x+3$ metres. Its area is $40$ square metres. Form and solve a quadratic equation by factorising, then state both dimensions.",
    "marks": 3,
    "markScheme": [
      "Forms $x(x+3)=40$, so $x^2+3x-40=0$.",
      "Factorises to $(x+8)(x-5)=0$, giving −8 or 5.",
      "Rejects the negative width: width 5 m and length 8 m; area 40 m²."
    ],
    "answer": "$x(x+3)=40$, so $x^2+3x-40=0$. Factorising gives $(x+8)(x-5)=0$. The roots are −8 and 5; only 5 is a valid width. The rectangle is 5 m by 8 m, and $5 \\times 8=40$ m².",
    "notation": true
  },
  "y10-maths-geometry/exam-6-AQA-Higher": {
    "question": "In triangles $ABC$ and $DEF$, $AB = 6\\text{ cm}$, $BC = 9\\text{ cm}$, $DE = 3\\text{ cm}$, $EF = 4.5\\text{ cm}$, and $\\angle ABC = \\angle DEF$. Prove that triangles $ABC$ and $DEF$ are similar.",
    "marks": 4,
    "markScheme": [
      "AB:DE = BC:EF with AB/DE = 6/3 = 2 and BC/EF = 9/4.5 = 2",
      "$\\angle ABC = \\angle DEF$",
      "By SAS similarity, triangles $ABC$ and $DEF$ are similar",
      "Therefore corresponding angles are equal $\\angle A = \\angle D$, $\\angle B = \\angle E$, $\\angle C = \\angle F$, and $\\dfrac{AB}{DE} = \\dfrac{BC}{EF} = \\dfrac{AC}{DF}$"
    ],
    "answer": "Since $\\dfrac{AB}{DE} = \\dfrac{6\\text{ cm}}{3\\text{ cm}} = 2$ and $\\dfrac{BC}{EF} = \\dfrac{9\\text{ cm}}{4.5\\text{ cm}} = 2$, and $\\angle ABC = \\angle DEF$, triangles $ABC$ and $DEF$ are similar by SAS similarity. Therefore $\\dfrac{AB}{DE} = \\dfrac{BC}{EF} = \\dfrac{AC}{DF}$ and $\\angle A = \\angle D$, $\\angle B = \\angle E$, $\\angle C = \\angle F$. Hence $\\dfrac{AC}{DF} = 2$.",
    "notation": true
  },
  "y10-maths-geometry/practice-3-AQA-Higher": {
    "question": "In triangles $ABC$ and $PQR$, $AB = 6$ cm, $BC = 8$ cm, $AC = 10$ cm; angle $\\angle B = 90^\\circ$. In triangle $PQR$, $PQ = 12$ cm, $QR = 16$ cm, $PR = 20$ cm; angle $\\angle Q = 90^\\circ$. Prove that triangles $ABC$ and $PQR$ are similar.",
    "hint": "The two triangles have a right angle and $AB:BC = PQ:QR$; use SAS similarity.",
    "working": [
      "$\\angle B = 90^\\circ$ and $\\angle Q = 90^\\circ$, so $\\angle B = \\angle Q$.",
      "$\\dfrac{AB}{BC} = \\dfrac{6}{8} = \\dfrac{3}{4}$ and $\\dfrac{PQ}{QR} = \\dfrac{12}{16} = \\dfrac{3}{4}$, hence $AB:BC = PQ:QR$.",
      "By SAS similarity, triangles $ABC$ and $PQR$ are similar with correspondence $AB \\leftrightarrow PQ$, $BC \\leftrightarrow QR$, $AC \\leftrightarrow PR$."
    ],
    "answer": "Triangles $ABC$ and $PQR$ are similar; corresponding sides are $AB \\leftrightarrow PQ$, $BC \\leftrightarrow QR$, $AC \\leftrightarrow PR$; the scale factor from $ABC$ to $PQR$ is $2$ (the ratio of corresponding original to enlarged lengths is $1:2$).",
    "notation": true
  },
  "y10-maths-mensuration/exam-6-AQA-Foundation": {
    "question": "A circular garden bed has radius $4.5$ m. A path is laid around $40\\%$ of the circumference of the bed. (a) Calculate the length of the path in metres. (b) Calculate the area, in square metres, of the sector of the circle that corresponds to that $40\\%$.",
    "marks": 4,
    "markScheme": [
      "Use arc length formula for a fraction of a circle: $L = 0.4 \\times (2\\pi \\times 4.5)$ metres.",
      "Compute circumference: $2\\pi r = 2\\pi \\times 4.5 = 9\\pi$ metres.",
      "Therefore arc length: $L = 0.4 \\times 9\\pi = 3.6\\pi$ metres, approximately $11.3$ metres.",
      "Area of circle: $\\pi r^2 = \\pi \\times (4.5)^2 = 20.25\\pi$ square metres; sector area for $40\\%$: $0.4 \\times 20.25\\pi = 8.1\\pi$ square metres, approximately $25.4$ square metres."
    ],
    "answer": "(a) $11.3 \\mathrm{m}$ (b) $25.4 \\mathrm{m}^2$",
    "notation": true
  },
  "y10-maths-mensuration/exam-6-Edexcel-Foundation": {
    "question": "A circular flower bed has a radius of 6.5 cm. Using π = 3.14, calculate its circumference and its area. Give your answers to 2 decimal places and include the units in your final answers.",
    "marks": 4,
    "markScheme": [
      "C = 2πr with r = 6.5 cm and π = 3.14 to give circumference, C = 40.82 cm.",
      "A = π r^2 with r = 6.5 cm and π = 3.14 to give area, A = 132.67 cm^2.",
      "Answers to 2 decimal places.",
      "Units: circumference in cm and area in cm^2."
    ],
    "answer": "Circumference = 40.82 cm; Area = 132.67 cm^2",
    "notation": true
  },
  "y10-maths-number/exam-3-Edexcel-Higher": {
    "question": "Question 4 (Use standard form). (a) Evaluate $\\left(3.6 \\times 10^{4}\\right) \\times \\left(2.5 \\times 10^{3}\\right)$. Give your answer in standard form. (b) Write $0.000072$ in standard form. (c) The value of $x$ is $6.0 \\times 10^{5}$ and the value of $y$ is $3.0 \\times 10^{2}$. Compute $x \\div y$ and give your answer in standard form.",
    "marks": 4,
    "markScheme": [
      "$3.6 \\times 2.5 = 9.0$",
      "$10^{4} \\times 10^{3} = 10^{7}$ and final answer $9.0 \\times 10^{7}$",
      "$0.000072$ written in standard form: $7.2 \\times 10^{-5}$",
      "$(6.0 \\times 10^{5}) ÷ (3.0 \\times 10^{2}) = (6.0 ÷ 3.0) \\times (10^{5} ÷ 10^{2}) = 2.0 \\times 10^{3}$"
    ],
    "answer": "a) $9.0 \\times 10^{7}$; b) $7.2 \\times 10^{-5}$; c) $2.0 \\times 10^{3}$",
    "notation": true
  },
  "y10-maths-number/exam-6-AQA-Higher": {
    "question": "Question 7: Two masses are given in standard form: $4.50 \\times 10^{2}$ kg and $7.20 \\times 10^{3}$ kg. Calculate the total mass and express your answer in standard form to 3 significant figures.",
    "marks": 3,
    "markScheme": [
      "Rewrite $4.50 \\times 10^{2}$ kg as $0.450 \\times 10^{3}$ kg. [1]",
      "Add the coefficients: $0.450 + 7.200 = 7.650$, giving $7.650 \\times 10^{3}$ kg. [1]",
      "Express the result in standard form to 3 s.f.: $7.65 \\times 10^{3}$ kg. [1]"
    ],
    "answer": "$450 + 7200 = 7650$ kg, or $7.65 \\times 10^3$ kg to three significant figures.",
    "notation": true
  },
  "y10-maths-number/exam-7-Edexcel-Higher": {
    "question": "An object’s length is measured with a ruler to the nearest $0.01\\,\\text{m}$. The reading is $L = 3.58\\,\\text{m}$. (a) Find the largest possible absolute error. (b) State the error interval for the true length.",
    "marks": 3,
    "markScheme": [
      "Correct largest possible absolute error is $0.005\\,\\text{m}$.",
      "Lower bound is $3.575\\,\\text{m}$.",
      "The interval is 3.575 m ≤ L < 3.585 m; the upper endpoint is excluded."
    ],
    "answer": "Maximum absolute error: 0.005 m. The error interval is $3.575 \\le L < 3.585$ metres.",
    "notation": true
  },
  "y10-maths-number/practice-1-AQA-Higher": {
    "question": "A length is measured as 47.0 cm to the nearest 0.5 cm. Calculate the interval for the true length, giving the lower bound and upper bound in centimetres.",
    "hint": "Use half of the rounding unit.",
    "working": [
      "L = 47.0 cm, measured to the nearest 0.5 cm.",
      "δ = $\\frac{0.5}{2} = 0.25$ cm.",
      "Lower bound = $L - \\delta = 47.0 - 0.25 = 46.75$ cm.",
      "Upper bound = $L + \\delta = 47.0 + 0.25 = 47.25$ cm.",
      "True length lies between $46.75 \\text{ cm}$ and $47.25 \\text{ cm}$."
    ],
    "answer": "$46.75 \\le L < 47.25$ cm, using the usual round-half-up convention.",
    "notation": true
  },
  "y10-maths-probability/exam-7-AQA-Higher": {
    "question": "Question 8 — Describe a probability tree in text to model the following situation. A student is answering a single question. There is a $0.60$ probability that they have studied for this topic before attempting the question. If they have studied, the probability of answering the question correctly is $0.75$; if they have not studied, the probability of answering correctly is $0.25$. (i) State the two stages and branch probabilities, including $P(S)=0.60$, $P(\\neg S)=0.40$, $P(C|S)=0.75$, $P(C|\\neg S)=0.25$. (ii) Use the diagram to find the overall probability that the student answers correctly. Give your answer to two decimal places.",
    "marks": 5,
    "markScheme": [
      "Correctly identifies the two initial branches with probabilities $P(S)=0.60$ and $P(\\neg S)=0.40$.",
      "Correctly states conditional probabilities on the studied branch: $P(C|S)=0.75$, $P(\\neg C|S)=0.25$.",
      "Correctly states conditional probabilities on the not-studied branch: $P(C|\\neg S)=0.25$, $P(\\neg C|\\neg S)=0.75$.",
      "Applies the law of total probability and computes $P(C)=0.60 \\times 0.75 + 0.40 \\times 0.25 = 0.55$.",
      "States the final answer $P(C)=0.55$ (equivalently $55\\%$)."
    ],
    "answer": "First stage: studied 0.60, not studied 0.40. From studied: correct 0.75, incorrect 0.25. From not studied: correct 0.25, incorrect 0.75. The probability of a correct answer is 0.60 × 0.75 + 0.40 × 0.25 = 0.45 + 0.10 = 0.55.",
    "notation": true
  },
  "y10-maths-probability/practice-4-AQA-Higher": {
    "question": "A factory uses two machines, A and B, to produce bulbs. The probability that a randomly chosen bulb is produced by machine A is $0.55$, and by machine B is $0.45$. For bulbs from machine A, the probability of being non-defective is $0.92$ (defective $0.08$). For bulbs from machine B, the probability of being non-defective is $0.94$ (defective $0.06$). Construct the probabilities on a tree diagram by listing each branch with its probability. Then answer: (a) Find the overall probability that a randomly chosen bulb is non-defective. (b) Find the probability that a bulb is non-defective given that it came from machine B.",
    "hint": "Start from the first split and multiply the branch probabilities along each path.",
    "working": [
      "$P(A)=0.55$, $P(B)=0.45$, $P(N|A)=0.92$, $P(D|A)=0.08$, $P(N|B)=0.94$, $P(D|B)=0.06$.",
      "$P(N)=P(A)P(N|A)+P(B)P(N|B)=0.55\\times0.92+0.45\\times0.94$.",
      "$0.55\\times0.92=0.506$.",
      "$0.45\\times0.94=0.423$.",
      "$P(N)=0.506+0.423=0.929$.",
      "For part (b), the machine is already known to be B, so read its non-defective branch: $P(N|B)=0.94$."
    ],
    "answer": "Tree branches: $P(A)=0.55$, $P(B)=0.45$; from A, $P(N|A)=0.92$, $P(D|A)=0.08$; from B, $P(N|B)=0.94$, $P(D|B)=0.06$. (a) $P(N)=0.929$, or $92.9\\%$. (b) $P(N|B)=0.94$, or $94\\%$.",
    "notation": true
  },
  "y10-maths-ratio/exam-2-AQA-Higher": {
    "question": "An item has a price of £120. It increases by 15%, then decreases by 20%, then increases by 10%. Work out the final price in pounds, to the nearest penny. Show all your working, with units included. You may use the multipliers $1.15$, $0.80$, and $1.10$ to represent the percentage changes, so that the final price is $120 \\times 1.15 \\times 0.80 \\times 1.10$.",
    "marks": 3,
    "markScheme": [
      "Correctly applies the first change to get £138.00 (since $120 \\times 1.15 = 138.00$).",
      "Correctly applies the second change to get £110.40 (since $138.00 \\times 0.80 = 110.40$).",
      "Correctly applies the third change to obtain the final price £121.44 (since $110.40 \\times 1.10 = 121.44$)."
    ],
    "answer": "£121.44",
    "notation": true
  },
  "y10-maths-ratio/exam-2-Edexcel-Higher": {
    "question": "A starting amount of $\\pounds1200$ is increased by $6\\%$ in year 1 and then by $4\\%$ in year 2. Calculate the amount after year 2, correct to the nearest penny, and give your answer in pounds.",
    "marks": 3,
    "markScheme": [
      "Correctly applies the first percentage change: $1200 \\times 1.06 = 1272$, so the amount becomes $\\pounds1272$.",
      "Correctly applies the second percentage change: $1272 \\times 1.04 = 1322.88$, giving $\\pounds1322.88$.",
      "States the final amount: $\\pounds1322.88$ (to the nearest penny)."
    ],
    "answer": "$\\pounds1322.88$",
    "notation": true
  },
  "y10-maths-ratio/exam-5-AQA-Higher": {
    "question": "A gadget is priced at $\\pounds60.00$. It is first increased by $20\\%$, then decreased by $15\\%$ on the new price, and finally increased by $5\\%$ on the latest amount. What is the final price of the gadget, to the nearest penny?",
    "marks": 4,
    "markScheme": [
      "First change: $\\pounds60.00 \\times 1.20 = \\pounds72.00$.",
      "Second change: $\\pounds72.00 \\times 0.85 = \\pounds61.20$.",
      "Third change: $\\pounds61.20 \\times 1.05 = \\pounds64.26$.",
      "Final price: $\\pounds64.26$."
    ],
    "answer": "$\\pounds64.26$",
    "notation": true
  },
  "y10-maths-ratio/exam-5-Edexcel-Higher": {
    "question": "A car is worth £12{,}000 at the start. In Year 1 it increases by $12\\%$, and in Year 2 it decreases by $20\\%$. Calculate the value at the end of Year 2 and the overall percentage change from the start. Show all steps in your working.",
    "marks": 4,
    "markScheme": [
      "After the increase: £12,000 × 1.12 = £13,440.",
      "After the decrease: £13,440 × 0.80 = £10,752.",
      "Overall change: (10,752 − 12,000) ÷ 12,000 × 100 = −10.4%.",
      "Concludes that the final value is £10,752 and the overall change is a 10.4% decrease."
    ],
    "answer": "The final value is £10,752. The overall change is a 10.4% decrease.",
    "notation": true
  },
  "y10-maths-ratio/exam-8-AQA-Higher": {
    "question": "Question 9 (Apply repeated percentage change). A coffee shop sells a small coffee for £2.30. Over three successive months the price changes by +9%, -4% and +6% respectively. (a) Calculate the price after the first change, showing your work. (b) Calculate the price after the second change, showing your work. (c) Calculate the price after the third change, showing your work. (d) Give the final price after the three changes to the nearest penny. (e) By what percentage has the price changed overall compared with the original price? (f) If there is a further increase of +3% in month 4, what is the new price to the nearest penny? Keep unrounded values between stages; round only the requested monetary answers.",
    "marks": 6,
    "markScheme": [
      "P1 = $2.30 \\times 1.09 = 2.507$ (pounds)",
      "P2 = $2.507 \\times 0.96 = 2.40672$ (pounds)",
      "P3 = $2.40672 \\times 1.06 = 2.5511232$ (pounds)",
      "Final price after three changes = £2.55",
      "Overall percentage change = $\\left(\\frac{2.5511232}{2.30}-1\\right) \\times 100 = 10.9184\\% \\approx 10.92\\%$",
      "P4 after month 4 +3% = $2.5511232 \\times 1.03 = 2.627656896$ (pounds) → £2.63"
    ],
    "answer": "(a) £2.51 (since $2.30 \\times 1.09 = 2.507$) (b) £2.41 (since $2.507 \\times 0.96 = 2.40672$) (c) £2.55 (since $2.40672 \\times 1.06 = 2.5511232$) (d) £2.55 (e) 10.92% (f) £2.63 (since $2.5511232 \\times 1.03 = 2.627656896$)",
    "notation": true
  },
  "y10-maths-ratio/exam-8-Edexcel-Higher": {
    "question": "A cinema ticket costs $\\pounds 9.50$. In Year 1 the price increases by $12\\%$, and in Year 2 the price increases again by $3\\%$. (a) Calculate the price after Year 2 (show your working). (b) By what percentage has the price increased overall from the original price to the Year 2 price? (c) Give the final price after Year 2 to the nearest penny.",
    "marks": 4,
    "markScheme": [
      "Compute $P_1 = \\pounds 9.50 \\times 1.12 = \\pounds 10.64$ and $P_2 = P_1 \\times 1.03 = \\pounds 10.9592$.",
      "The exact final price after Year 2 is $\\pounds 10.9592$.",
      "Overall percentage change from the original price: $\\frac{P_2 - 9.50}{9.50} \\times 100 = 15.36\\%$.",
      "Final price to the nearest penny: $\\pounds 10.96$."
    ],
    "answer": "Final price after Year 2: $\\pounds 10.96$; Overall percentage change: $15.36\\%$",
    "notation": true
  },
  "y10-maths-ratio/exam-9-Edexcel-Foundation": {
    "question": "Question 10: A scale drawing uses a scale factor of $1\\text{ cm}$ on the drawing represents $50\\text{ cm}$ in real life. A bench on the drawing measures $7.5\\text{ cm}$ in length. Work out the real length of the bench in centimetres and in metres. A statue on the drawing has a length of $3.5\\text{ cm}$. Work out its real length in centimetres and in metres. The real width of the park is $120\\text{ m}$. What length does this correspond to on the drawing, in centimetres?",
    "marks": 4,
    "markScheme": [
      "Correctly converts a drawing length to a real length by multiplying by 50: $7.5\\text{ cm} \\times 50 = 375\\text{ cm} = 3.75\\text{ m}$.",
      "Correctly converts a second drawing length to a real length by multiplying by 50: $3.5\\text{ cm} \\times 50 = 175\\text{ cm} = 1.75\\text{ m}$.",
      "Converts 120 m to 12,000 cm.",
      "Divides 12,000 by 50 to obtain 240 cm on the drawing."
    ],
    "answer": "Real length of the bench: $7.5\\text{ cm} \\times 50 = 375\\text{ cm} = 3.75\\text{ m}$. Real length of the statue: $3.5\\text{ cm} \\times 50 = 175\\text{ cm} = 1.75\\text{ m}$. Length on the drawing corresponding to the real park width: $120\\text{ m} = 12000\\text{ cm}$, then $12000\\text{ cm} \\div 50 = 240\\text{ cm}$.",
    "notation": true
  },
  "y10-maths-ratio/practice-2-AQA-Higher": {
    "question": "A video game console is priced at £240. It first increases by 12%, then increases by 3%, and finally decreases by 7%. What is the final price of the console, to the nearest penny? [3 marks]",
    "hint": "Multiply by 1.12, then 1.03, then 0.93.",
    "working": [
      "Step 1: $£240 \\times 1.12 = £268.80$",
      "Step 2: $£268.80 \\times 1.03 = £276.864$",
      "Step 3: $£276.864 \\times 0.93 = £257.48352$"
    ],
    "answer": "£257.48",
    "notation": true
  },
  "y10-maths-ratio/practice-2-Edexcel-Higher": {
    "question": "A bottle of fruit juice normally costs $3.20$ pounds. The price is increased by $15\\%$ in a winter promotion, and then reduced by $5\\%$ later the same day. What is the final price of the bottle, to the nearest penny?",
    "hint": "Apply the percentage changes in order by multiplying by the appropriate factors: first 1.15, then 0.95.",
    "working": [
      "$3.20 \\times 1.15 = 3.68$",
      "$3.68 \\times 0.95 = 3.496$",
      "$3.496$ rounds to $3.50$"
    ],
    "answer": "£3.50",
    "notation": true
  },
  "y10-maths-ratio/practice-5-AQA-Higher": {
    "question": "Question 6. A video game console has a starting price of £$180$. In the first month the price increases by $10\\%$, in the second month it decreases by $6\\%$, and in the third month it increases by $4\\%$. What is the final price after the third month, to the nearest penny?",
    "hint": "Apply each percentage change to the price obtained after the previous change, using the multipliers $1.10$, $0.94$, and $1.04$ in that order.",
    "working": [
      "$180 \\times 1.10 = 198.00$",
      "$198.00 \\times 0.94 = 186.12$",
      "$186.12 \\times 1.04 = 193.5648$",
      "$193.5648$ rounds to £193.56"
    ],
    "answer": "£$193.56$",
    "notation": true
  },
  "y10-maths-ratio/practice-5-Edexcel-Higher": {
    "question": "A gadget is priced at £180. It increases by 12% and then decreases by 5%. Work out the final price in pounds, to the nearest penny.",
    "hint": "Use multipliers for each percentage change and apply them in the given order.",
    "working": [
      "Step 1: After a 12% increase, price becomes $180 \\times 1.12 = 201.6$ pounds.",
      "Step 2: After a 5% decrease, final price becomes $201.6 \\times 0.95 = 191.52$ pounds."
    ],
    "answer": "£191.52",
    "notation": true
  },
  "y10-maths-ratio/practice-8-AQA-Higher": {
    "question": "Question 9 (Apply repeated percentage change) A bike is priced at £180. The price increases by $8\\%$ in year 1, then decreases by $5\\%$ in year 2, and finally increases by $3\\%$ in year 3. Work out the final price of the bike, to the nearest penny.",
    "hint": "Think of the three changes as multipliers and multiply them together to get the overall multiplier; total factor $=(1+0.08)\\times(1-0.05)\\times(1+0.03)$.",
    "working": [
      "Final price after three changes = £$180$ $\\times$ $(1+0.08)$ $\\times$ $(1-0.05)$ $\\times$ $(1+0.03)$.",
      "Product of the factors = $1.08$ $\\times$ $0.95$ $\\times$ $1.03$.",
      "Therefore final price = £$180$ $\\times$ $(1.08 \\times 0.95 \\times 1.03)$.",
      "$1.08 \\times 0.95 = 1.026$.",
      "$1.026 \\times 1.03 = 1.05678$.",
      "Final price = £$180$ $\\times$ $1.05678$ = £$190.2204$.",
      "Rounded to the nearest penny: £$190.22$."
    ],
    "answer": "£$190.22$",
    "notation": true
  },
  "y10-maths-ratio/practice-8-Edexcel-Higher": {
    "question": "A jacket is originally priced at £54.00. In Week 1 the price increases by 20%, and in Week 2 it decreases by 25%. What is the final sale price after both changes? Give your answer to the nearest penny.",
    "hint": "Apply each percentage change in the given order; multiply by 1.20 first, then by 0.75.",
    "working": [
      "Step 1: $54.00 \\times 1.20 = 64.80$.",
      "Step 2: $64.80 \\times 0.75 = 48.60$.",
      "Step 3: Final price = £48.60."
    ],
    "answer": "£48.60",
    "notation": true
  },
  "y10-science-atomic/exam-1-Edexcel-Higher": {
    "question": "Compare bonding in three substances: solid sodium chloride (ionic), diamond (covalent network), and magnesium (metallic). For each, explain how the bonding type affects (a) melting point, (b) electrical conductivity in the solid state, and (c) solubility in water. Use these examples to justify your explanations.",
    "marks": 5,
    "markScheme": [
      "NaCl has a giant ionic lattice with strong attractions and a high melting point.",
      "Solid NaCl does not conduct because its ions cannot move; it dissolves in water, where ions can move.",
      "Diamond has a giant covalent structure with many strong bonds, giving a very high melting point.",
      "Diamond is insoluble and does not conduct because it lacks mobile charge carriers; graphite is a different giant covalent structure that does conduct.",
      "Magnesium has strong metallic bonding, a relatively high melting point and mobile delocalised electrons, so the solid conducts; it does not simply dissolve in water like salt."
    ],
    "answer": "NaCl’s strong ionic attractions give it a high melting point. Its ions are fixed in the solid, preventing conduction; dissolved ions can carry charge. Diamond has many strong covalent bonds, a very high melting point, no mobile charge carriers and is insoluble in water. Magnesium has metallic bonding and a relatively high melting point; its delocalised electrons carry current in the solid. It does not simply dissolve like salt, although reaction with water is a separate chemical question. Diamond’s lack of conduction must not be generalised to graphite.",
    "notation": false
  },
  "y10-science-atomic/practice-6-AQA-Higher": {
    "question": "A neutral chlorine atom has atomic number 17. Describe its electronic structure using shells and explain how it forms a chloride ion.",
    "hint": "A neutral atom has as many electrons as protons. Use the shell model for the first twenty elements.",
    "working": [
      "Atomic number 17 means 17 protons; a neutral chlorine atom therefore has 17 electrons.",
      "Place 2 electrons in the first shell and 8 in the second, leaving 7 in the third: 2,8,7.",
      "Chlorine can gain one electron to form a chloride ion with arrangement 2,8,8.",
      "The ion has one more electron than protons, so its charge is −1."
    ],
    "answer": "The neutral atom has electronic structure 2,8,7. It gains one electron to form Cl− with structure 2,8,8.",
    "notation": false
  },
  "y10-science-bioenergetics/exam-0-AQA-Foundation": {
    "question": "A plant carries out photosynthesis. Name the two reactants and the two products, write the word equation, and explain why light is needed.",
    "marks": 3,
    "markScheme": [
      "The reactants are carbon dioxide and water.",
      "The products are glucose and oxygen: carbon dioxide + water → glucose + oxygen.",
      "Light transfers energy for the endothermic process."
    ],
    "answer": "The reactants are carbon dioxide and water. The products are glucose and oxygen: carbon dioxide + water → glucose + oxygen. Light transfers energy for the endothermic process.",
    "notation": false
  },
  "y10-science-bioenergetics/exam-4-Edexcel-Foundation": {
    "question": "Question 5 (Edexcel Foundation, Year 10): Explain three uses of glucose in plants and why each use is important for the plant. Include respiration to release energy, storage as starch for later use, and production of cellulose for cell walls.",
    "marks": 6,
    "markScheme": [
      "1 mark: glucose is used in respiration.",
      "1 mark: respiration releases energy for cellular processes.",
      "1 mark: glucose can be converted to starch for storage.",
      "1 mark: stored starch provides a reserve that can be converted back to sugars when needed.",
      "1 mark: glucose is used to make cellulose.",
      "1 mark: cellulose strengthens plant cell walls and supports structure."
    ],
    "answer": "Glucose is used in respiration, releasing energy for cellular processes such as growth and active transport. It can be converted into starch for storage, providing a reserve that can be converted back to sugars when needed. Glucose is also used to make cellulose, which strengthens plant cell walls and helps support the plant.",
    "notation": false
  },
  "y10-science-bioenergetics/exam-6-AQA-Foundation": {
    "question": "Question 7: In photosynthesis the overall equation is 6 CO2 + 6 H2O → C6H12O6 + 6 O2. In a simplified particle-counting model, 18 CO2 molecules react with sufficient water and light according to this overall equation. For part (c), compare the required water with 18 H2O molecules. Assuming all 18 CO2 molecules are used, answer: (a) How many O2 molecules are produced? (b) How many glucose (C6H12O6) molecules are produced? (c) Is the 18 molecules of H2O enough for 18 CO2? (d) State the ratio of CO2 molecules to O2 molecules in this reaction.",
    "marks": 4,
    "markScheme": [
      "18 O2 molecules produced from 18 CO2 (same 1:1 ratio as in the equation).",
      "3 molecules of glucose produced (18 CO2 ÷ 6 = 3).",
      "Water is enough: 18 H2O are provided, which is exactly the amount needed for 18 CO2 (water is not limiting).",
      "The ratio of CO2 to O2 molecules is 1:1."
    ],
    "answer": "(a) 18 O2 molecules. (b) 3 molecules of glucose (C6H12O6). (c) Yes — 18 H2O is enough for 18 CO2 (the required amount of water for 18 CO2 is 18 H2O). (d) The ratio of CO2 to O2 molecules is 1:1.",
    "notation": false
  },
  "y10-science-bioenergetics/exam-6-Edexcel-Foundation": {
    "question": "A plant carries out photosynthesis. Name the two reactants and the two products, write the word equation, and explain why light is needed.",
    "marks": 3,
    "markScheme": [
      "The reactants are carbon dioxide and water.",
      "The products are glucose and oxygen: carbon dioxide + water → glucose + oxygen.",
      "Light transfers energy for the endothermic process."
    ],
    "answer": "The reactants are carbon dioxide and water. The products are glucose and oxygen: carbon dioxide + water → glucose + oxygen. Light transfers energy for the endothermic process.",
    "notation": false
  },
  "y10-science-bioenergetics/exam-6-Edexcel-Higher": {
    "question": "For a simplified calculation, assume photosynthesis converts 264 g of carbon dioxide and 108 g of water completely into glucose and oxygen according to $6CO_2 + 6H_2O \\rightarrow C_6H_{12}O_6 + 6O_2$. Use relative atomic masses C = 12, H = 1 and O = 16. Calculate the mass of glucose produced, showing your working.",
    "marks": 5,
    "markScheme": [
      "1 mark: calculates molar masses CO2 = 44 g/mol, H2O = 18 g/mol and glucose = 180 g/mol.",
      "1 mark: calculates carbon dioxide amount as 264 / 44 = 6 mol.",
      "1 mark: calculates water amount as 108 / 18 = 6 mol.",
      "1 mark: uses the equation ratio 6 : 6 : 1 to obtain 1 mol glucose.",
      "1 mark: calculates glucose mass as 1 x 180 = 180 g."
    ],
    "answer": "Molar masses: carbon dioxide 44 g/mol, water 18 g/mol and glucose 180 g/mol. The amounts are 264 / 44 = 6 mol carbon dioxide and 108 / 18 = 6 mol water. These are in the 6 : 6 ratio required to produce 1 mol glucose. Its mass is 1 x 180 = 180 g.",
    "notation": true
  },
  "y10-science-bioenergetics/exam-7-AQA-Foundation": {
    "question": "A pondweed produces 8 bubbles per minute in dim light and 16 per minute in brighter light. Temperature, pondweed size and carbon dioxide availability are kept the same. Describe the result and explain one limitation of counting bubbles.",
    "marks": 3,
    "markScheme": [
      "The measured bubble rate increases when light intensity increases.",
      "More light supplies more energy for photosynthesis under these conditions.",
      "Bubbles may differ in size, so measuring oxygen volume in a fixed time would be a better measure than counting bubbles alone."
    ],
    "answer": "The measured bubble rate increases when light intensity increases. More light supplies more energy for photosynthesis under these conditions. Bubbles may differ in size, so measuring oxygen volume in a fixed time would be a better measure than counting bubbles alone.",
    "notation": false
  },
  "y10-science-bioenergetics/exam-7-Edexcel-Foundation": {
    "question": "A plant’s rate of photosynthesis is measured by the volume of oxygen produced per hour (cm^3/h) under different conditions. The data are: Condition A — light intensity 200 lux, CO2 0.04% (400 ppm), temperature 20°C; rate = 6 cm^3/h. Condition B — light intensity 600 lux, CO2 0.04%, temperature 20°C; rate = 9 cm^3/h. Condition C — light intensity 600 lux, CO2 0.08%, temperature 20°C; rate = 14 cm^3/h. Condition D — light intensity 600 lux, CO2 0.04%, temperature 25°C; rate = 12 cm^3/h. Condition E — light intensity 600 lux, CO2 0.04%, temperature 10°C; rate = 4 cm^3/h. Using this data, identify which factor is limiting photosynthesis in Condition A and in Condition E. Give a brief reason for each.",
    "marks": 4,
    "markScheme": [
      "Identifies light as a limiting factor in A.",
      "Compares A with B: rate rises 6 to 9 cm³/h when light increases while other stated conditions stay constant.",
      "Identifies temperature as a limiting factor in E.",
      "Compares E with B or D: rate rises at higher temperature with light and CO2 unchanged."
    ],
    "answer": "Condition A — light is the limiting factor; increasing light from 200 lux to 600 lux (while CO2 and temperature remain constant) increases the rate from 6 to 9 cm^3/h, indicating light limits the rate at A. Condition E — temperature is the limiting factor; increasing temperature from 10°C to 20°C or 25°C (with the same light and CO2) increases the rate from 4 cm^3/h to 9 cm^3/h or 12 cm^3/h, indicating temperature limits the rate at E.",
    "notation": false
  },
  "y10-science-bioenergetics/practice-2-AQA-Foundation": {
    "question": "Compare anaerobic respiration in human muscles during intense exercise with anaerobic respiration in yeast during bread making. State the products and whether oxygen is needed. Explain how the energy released per glucose compares with aerobic respiration, and name where anaerobic respiration occurs in the cell.",
    "hint": "Compare the products, oxygen requirement, energy release and cell location.",
    "working": [
      "Both anaerobic pathways occur without oxygen in the cytoplasm.",
      "In human muscles, glucose is incompletely broken down to lactic acid.",
      "In yeast, anaerobic respiration produces ethanol and carbon dioxide; the carbon dioxide helps bread dough rise.",
      "Both release less energy per glucose than aerobic respiration because glucose is not completely broken down."
    ],
    "answer": "Anaerobic respiration occurs in the cytoplasm without oxygen. In human muscles it produces lactic acid; in yeast it produces ethanol and carbon dioxide. Both release less energy per glucose than aerobic respiration. Aerobic respiration uses oxygen and produces carbon dioxide and water.",
    "notation": false
  },
  "y10-science-bioenergetics/practice-6-AQA-Foundation": {
    "question": "A plant carries out photosynthesis. Name the two reactants and the two products, write the word equation, and explain why light is needed.",
    "hint": "Identify the scientific principle, apply it to the information given and explain your conclusion.",
    "working": [
      "The reactants are carbon dioxide and water.",
      "The products are glucose and oxygen: carbon dioxide + water → glucose + oxygen.",
      "Light transfers energy for the endothermic process."
    ],
    "answer": "The reactants are carbon dioxide and water. The products are glucose and oxygen: carbon dioxide + water → glucose + oxygen. Light transfers energy for the endothermic process.",
    "notation": false
  },
  "y10-science-cell-biology/exam-2-Edexcel-Higher": {
    "question": "Equal-sized potato cylinders are weighed separately and placed in different sucrose solutions for 60 minutes. Each is then blotted dry and reweighed. Define diffusion, osmosis and active transport. Explain how the cylinders could gain or lose mass, and state which processes require energy from respiration. No calculations are required.",
    "marks": 5,
    "markScheme": [
      "Diffusion is net particle movement from higher to lower concentration and requires no energy supplied by respiration.",
      "Osmosis is net water movement through a partially permeable membrane from a more dilute to a more concentrated solution.",
      "Water enters potato cells when the outside solution is more dilute than the cell contents, increasing mass.",
      "Water leaves when the outside solution is more concentrated; there may be no net movement at equal water potential.",
      "Active transport moves substances against a concentration gradient and requires energy from respiration; mineral-ion uptake by roots is an example."
    ],
    "answer": "Diffusion is the net movement of particles down a concentration gradient. Osmosis is net water movement through a partially permeable membrane from a more dilute solution towards a more concentrated one. Potato tissue gains mass when water enters and loses mass when water leaves; the direction depends on the solution relative to the cells. Neither process needs energy supplied by respiration, though particles are moving. Active transport moves substances against their concentration gradient using energy from respiration, for example mineral-ion uptake by root hair cells.",
    "notation": false
  },
  "y10-science-cell-biology/exam-4-AQA-Higher": {
    "question": "Compare a typical plant cell with a bacterial cell. Explain differences in nucleus, genetic material, mitochondria and typical size, then give one structure they share and its function.",
    "marks": 5,
    "markScheme": [
      "The plant cell has a nucleus; the bacterial cell does not.",
      "Plant nuclear DNA is in chromosomes; bacterial genetic material includes a circular DNA loop and may include plasmids.",
      "A typical plant cell contains mitochondria; bacteria do not.",
      "Bacterial cells are usually much smaller than plant cells.",
      "Both have a cell membrane controlling movement of substances, or ribosomes for protein synthesis, or cytoplasm where reactions occur."
    ],
    "answer": "A typical plant cell has a nucleus containing chromosomes and has mitochondria. A bacterial cell lacks a nucleus and mitochondria; its main DNA is a circular loop in the cytoplasm and it may have plasmids. Bacterial cells are generally much smaller. Both have a cell membrane controlling movement of substances, cytoplasm and ribosomes for protein synthesis.",
    "notation": false
  },
  "y10-science-cell-biology/exam-4-Edexcel-Higher": {
    "question": "Compare a typical plant cell with a bacterial cell. Explain differences in nucleus, genetic material, mitochondria and typical size, then give one structure they share and its function.",
    "marks": 5,
    "markScheme": [
      "The plant cell has a nucleus; the bacterial cell does not.",
      "Plant nuclear DNA is in chromosomes; bacterial genetic material includes a circular DNA loop and may include plasmids.",
      "A typical plant cell contains mitochondria; bacteria do not.",
      "Bacterial cells are usually much smaller than plant cells.",
      "Both have a cell membrane controlling movement of substances, or ribosomes for protein synthesis, or cytoplasm where reactions occur."
    ],
    "answer": "A typical plant cell has a nucleus containing chromosomes and has mitochondria. A bacterial cell lacks a nucleus and mitochondria; its main DNA is a circular loop in the cytoplasm and it may have plasmids. Bacterial cells are generally much smaller. Both have a cell membrane controlling movement of substances, cytoplasm and ribosomes for protein synthesis.",
    "notation": false
  },
  "y10-science-cell-biology/practice-1-AQA-Foundation": {
    "question": "Compare a typical photosynthetic plant leaf cell, a typical animal cell and a bacterial cell. Give two shared features, two features of the plant leaf cell absent from the animal cell, and one feature that distinguishes the bacterial cell from both eukaryotic cells.",
    "hint": "Think about basic cell features common to all cells and key differences in plant, animal and bacterial cells.",
    "working": [
      "All three have a cell membrane, cytoplasm and ribosomes; choose any two.",
      "The photosynthetic leaf cell has chloroplasts and a cellulose cell wall; the animal cell has neither.",
      "The bacterial cell has no membrane-bound nucleus: its main DNA is in the cytoplasm. Its wall is not made of cellulose."
    ],
    "answer": "Two shared features are a cell membrane and cytoplasm. The photosynthetic plant leaf cell has chloroplasts and a cellulose cell wall, which the animal cell lacks. The bacterial cell has no membrane-bound nucleus, unlike the two typical eukaryotic cells. Other plant cells, such as many root cells, do not have chloroplasts.",
    "notation": false
  },
  "y10-science-cell-biology/practice-1-Edexcel-Foundation": {
    "question": "Compare a typical photosynthetic plant leaf cell, a typical animal cell and a bacterial cell. Give two shared features, two features of the plant leaf cell absent from the animal cell, and one feature that distinguishes the bacterial cell from both eukaryotic cells.",
    "hint": "Focus on organelles: which are found in plant cells but not in animal cells, and what bacteria lack.",
    "working": [
      "All three have a cell membrane, cytoplasm and ribosomes; choose any two.",
      "The photosynthetic leaf cell has chloroplasts and a cellulose cell wall; the animal cell has neither.",
      "The bacterial cell has no membrane-bound nucleus: its main DNA is in the cytoplasm. Its wall is not made of cellulose."
    ],
    "answer": "Two shared features are a cell membrane and cytoplasm. The photosynthetic plant leaf cell has chloroplasts and a cellulose cell wall, which the animal cell lacks. The bacterial cell has no membrane-bound nucleus, unlike the two typical eukaryotic cells. Other plant cells, such as many root cells, do not have chloroplasts.",
    "notation": false
  },
  "y10-science-chemical-changes/exam-1-AQA-Foundation": {
    "question": "A molten ionic compound contains positive metal ions and negative non-metal ions. Explain why it conducts electricity, which electrode each ion moves towards, and why the solid compound does not conduct.",
    "marks": 3,
    "markScheme": [
      "In the molten compound the ions are free to move and carry charge.",
      "Positive ions move to the negative cathode; negative ions move to the positive anode.",
      "In the solid, the ions are fixed in position and cannot carry charge through the compound."
    ],
    "answer": "In the molten compound the ions are free to move and carry charge. Positive ions move to the negative cathode; negative ions move to the positive anode. In the solid, the ions are fixed in position and cannot carry charge through the compound.",
    "notation": false
  },
  "y10-science-chemical-changes/exam-2-AQA-Foundation": {
    "question": "A reaction profile has reactants at a higher energy level than the products, with a peak between them. Explain the overall energy transfer, identify the activation-energy barrier and describe what a catalyst changes.",
    "marks": 3,
    "markScheme": [
      "The reaction transfers energy to the surroundings, so it is exothermic.",
      "The activation-energy barrier is the rise from the reactant level to the peak.",
      "A catalyst provides a pathway with a lower activation energy without changing the reactant or product levels."
    ],
    "answer": "The reaction transfers energy to the surroundings, so it is exothermic. The activation-energy barrier is the rise from the reactant level to the peak. A catalyst provides a pathway with a lower activation energy without changing the reactant or product levels.",
    "notation": false
  },
  "y10-science-chemical-changes/exam-5-Edexcel-Foundation": {
    "question": "Hydrochloric acid reacts with sodium hydroxide. Name the products, write the word equation and explain what neutralisation means.",
    "marks": 3,
    "markScheme": [
      "The products are sodium chloride and water.",
      "Hydrochloric acid + sodium hydroxide → sodium chloride + water.",
      "Neutralisation is a reaction between an acid and a base; an acid reacting with an alkali produces a salt and water."
    ],
    "answer": "The products are sodium chloride and water. Hydrochloric acid + sodium hydroxide → sodium chloride + water. Neutralisation is a reaction between an acid and a base; an acid reacting with an alkali produces a salt and water.",
    "notation": false
  },
  "y10-science-chemical-changes/exam-6-AQA-Foundation": {
    "question": "Fresh, clean strips of magnesium, zinc and iron are placed separately into copper(II) sulfate solution. For each metal, state whether a reaction occurs and describe the observations. In a separate experiment, fresh strips of the same three metals are placed separately into dilute hydrochloric acid. State whether a reaction occurs and identify the gas produced. Explain both sets of results using the reactivity series.",
    "marks": 6,
    "markScheme": [
      "1 mark: states that all three metals displace copper from copper(II) sulfate.",
      "1 mark: describes a reddish-brown copper deposit on the strips.",
      "1 mark: describes the blue solution becoming paler as copper(II) ions are removed; accepts a pale green solution with iron.",
      "1 mark: states that all three metals react with dilute hydrochloric acid and produce bubbles of hydrogen.",
      "1 mark: explains displacement because magnesium, zinc and iron are above copper in the reactivity series.",
      "1 mark: explains hydrogen production because all three metals are above hydrogen in the reactivity series."
    ],
    "answer": "All three metals displace copper: a reddish-brown copper deposit forms and the blue copper(II) sulfate solution becomes paler. With iron, a pale green iron(II) sulfate solution may be seen. In the separate acid experiment, all three fresh metals react, producing bubbles of hydrogen. Magnesium, zinc and iron are above copper in the reactivity series, so they displace copper, and above hydrogen, so they displace hydrogen from dilute hydrochloric acid.",
    "notation": false
  },
  "y10-science-chemical-changes/exam-7-AQA-Foundation": {
    "question": "A molten ionic compound contains positive metal ions and negative non-metal ions. Explain why it conducts electricity, which electrode each ion moves towards, and why the solid compound does not conduct.",
    "marks": 3,
    "markScheme": [
      "In the molten compound the ions are free to move and carry charge.",
      "Positive ions move to the negative cathode; negative ions move to the positive anode.",
      "In the solid, the ions are fixed in position and cannot carry charge through the compound."
    ],
    "answer": "In the molten compound the ions are free to move and carry charge. Positive ions move to the negative cathode; negative ions move to the positive anode. In the solid, the ions are fixed in position and cannot carry charge through the compound.",
    "notation": false
  },
  "y10-science-chemical-changes/exam-9-AQA-Foundation": {
    "question": "Carbon is more reactive than zinc but less reactive than aluminium. Explain why heating zinc oxide with carbon can extract zinc, whereas this method cannot extract aluminium from aluminium oxide.",
    "marks": 3,
    "markScheme": [
      "Carbon can remove oxygen from zinc oxide because carbon is more reactive than zinc.",
      "Removal of oxygen from an oxide is reduction.",
      "Aluminium is more reactive than carbon, so carbon cannot reduce aluminium oxide; electrolysis is used instead."
    ],
    "answer": "Carbon can remove oxygen from zinc oxide because carbon is more reactive than zinc. Removal of oxygen from an oxide is reduction. Aluminium is more reactive than carbon, so carbon cannot reduce aluminium oxide; electrolysis is used instead.",
    "notation": false
  },
  "y10-science-chemical-changes/practice-3-AQA-Foundation": {
    "question": "Carbon is more reactive than zinc but less reactive than aluminium. Explain why heating zinc oxide with carbon can extract zinc, whereas this method cannot extract aluminium from aluminium oxide.",
    "hint": "Identify the scientific principle, apply it to the information given and explain your conclusion.",
    "working": [
      "Carbon can remove oxygen from zinc oxide because carbon is more reactive than zinc.",
      "Removal of oxygen from an oxide is reduction.",
      "Aluminium is more reactive than carbon, so carbon cannot reduce aluminium oxide; electrolysis is used instead."
    ],
    "answer": "Carbon can remove oxygen from zinc oxide because carbon is more reactive than zinc. Removal of oxygen from an oxide is reduction. Aluminium is more reactive than carbon, so carbon cannot reduce aluminium oxide; electrolysis is used instead.",
    "notation": false
  },
  "y10-science-chemical-changes/practice-3-Edexcel-Foundation": {
    "question": "When heated, copper oxide reacts with carbon to produce copper and carbon dioxide. Explain which substance is reduced, what reduction means here and why carbon can be used. The reactivity order includes carbon above copper.",
    "hint": "Identify the scientific principle, apply it to the information given and explain your conclusion.",
    "working": [
      "Copper oxide is reduced to copper.",
      "Reduction here means removal of oxygen from the metal oxide.",
      "Carbon is more reactive than copper, so it can remove oxygen from copper oxide."
    ],
    "answer": "Copper oxide is reduced to copper. Reduction here means removal of oxygen from the metal oxide. Carbon is more reactive than copper, so it can remove oxygen from copper oxide.",
    "notation": false
  },
  "y10-science-chemical-changes/practice-5-AQA-Foundation": {
    "question": "Sulfuric acid reacts with copper oxide to make copper sulfate and water. Explain why this is neutralisation and why excess copper oxide can be filtered off.",
    "hint": "Identify the scientific principle, apply it to the information given and explain your conclusion.",
    "working": [
      "Copper oxide is a base that reacts with the acid.",
      "The products are a salt, copper sulfate, and water; this is neutralisation.",
      "Copper oxide is insoluble, so any excess remains solid and can be removed by filtration."
    ],
    "answer": "Copper oxide is a base that reacts with the acid. The products are a salt, copper sulfate, and water; this is neutralisation. Copper oxide is insoluble, so any excess remains solid and can be removed by filtration.",
    "notation": false
  },
  "y10-science-chemical-changes/practice-5-Edexcel-Foundation": {
    "question": "Hydrochloric acid reacts with sodium hydroxide. Name the products, write the word equation and explain what neutralisation means.",
    "hint": "Identify the scientific principle, apply it to the information given and explain your conclusion.",
    "working": [
      "The products are sodium chloride and water.",
      "Hydrochloric acid + sodium hydroxide → sodium chloride + water.",
      "Neutralisation is a reaction between an acid and a base; an acid reacting with an alkali produces a salt and water."
    ],
    "answer": "The products are sodium chloride and water. Hydrochloric acid + sodium hydroxide → sodium chloride + water. Neutralisation is a reaction between an acid and a base; an acid reacting with an alkali produces a salt and water.",
    "notation": false
  },
  "y10-science-chemical-changes/practice-8-Edexcel-Higher": {
    "question": "A reaction profile has the following energy levels for the same fixed quantity of reacting material: reactants 80 kJ, products 30 kJ and the top of the uncatalysed energy barrier 140 kJ. (a) Is the reaction exothermic or endothermic? (b) Calculate the overall energy change, products minus reactants. (c) Calculate the activation energy. A catalyst provides an alternative pathway whose highest energy level is 110 kJ. (d) Calculate the new activation energy and explain whether the overall energy change is altered.",
    "hint": "Measure the overall change from reactants to products, and the activation barrier from reactants to the peak.",
    "working": [
      "Products are lower in energy than reactants, so energy is transferred to the surroundings: the reaction is exothermic.",
      "Overall energy change: $30 - 80 = -50$ kJ for the stated quantity.",
      "Uncatalysed activation energy: $140 - 80 = 60$ kJ.",
      "Catalysed activation energy: $110 - 80 = 30$ kJ.",
      "The reactant and product levels are unchanged, so the overall energy change remains $-50$ kJ."
    ],
    "answer": "(a) Exothermic. (b) $-50$ kJ. (c) $60$ kJ. (d) $30$ kJ. The catalyst lowers the activation energy through an alternative pathway; it does not change the overall energy change.",
    "notation": true
  },
  "y10-science-chemical-changes/practice-9-AQA-Foundation": {
    "question": "Carbon is more reactive than zinc but less reactive than aluminium. Explain why heating zinc oxide with carbon can extract zinc, whereas this method cannot extract aluminium from aluminium oxide.",
    "hint": "Identify the scientific principle, apply it to the information given and explain your conclusion.",
    "working": [
      "Carbon can remove oxygen from zinc oxide because carbon is more reactive than zinc.",
      "Removal of oxygen from an oxide is reduction.",
      "Aluminium is more reactive than carbon, so carbon cannot reduce aluminium oxide; electrolysis is used instead."
    ],
    "answer": "Carbon can remove oxygen from zinc oxide because carbon is more reactive than zinc. Removal of oxygen from an oxide is reduction. Aluminium is more reactive than carbon, so carbon cannot reduce aluminium oxide; electrolysis is used instead.",
    "notation": false
  },
  "y10-science-earth/exam-2-Edexcel-Higher": {
    "question": "Question 3 (Evaluate life-cycle assessments): A science club compares two bottle options: a single-use plastic bottle and a reusable stainless-steel bottle. Simplified teaching data for cradle-to-grave energy use are given below: Plastic bottle: manufacture 40 kJ, transport to shop 3 kJ, end-of-life energy 2 kJ; lifespan = 1 use. Reusable bottle: manufacture 600 kJ, transport to shop 3 kJ, washing energy per use 0.9 kJ, end-of-life energy 6 kJ; lifespan = 500 uses. Calculate the energy used per use for each bottle, showing all steps, and evaluate which option is more energy-efficient per use based on these data. Include a brief note on any limitations of this comparison.",
    "marks": 6,
    "markScheme": [
      "Calculates plastic energy 40 + 3 + 2 = 45 kJ per use.",
      "Adds reusable manufacture, transport and end-of-life energy: 609 kJ.",
      "Spreads fixed energy across 500 uses: 609/500 = 1.218 kJ per use.",
      "Adds 0.9 kJ washing per use: 2.118 kJ per use.",
      "Selects reusable as lower energy per use under the supplied data.",
      "Explains a limitation: assumed 500 uses, washing practice, or impacts other than energy."
    ],
    "answer": "Plastic bottle per-use energy: Manufacturing energy: 40 kJ Transport energy: 3 kJ End-of-life energy: 2 kJ Total per-use energy for plastic = 40 + 3 + 2 = 45 kJ per use Reusable bottle per-use energy: Lifetime production and transport energy spread over uses: (600 kJ + 3 kJ) / 500 uses = 603 / 500 = 1.206 kJ per use Washing energy per use: 0.9 kJ End-of-life energy spread over uses: 6 kJ / 500 uses = 0.012 kJ per use Total per-use energy for reusable = 1.206 + 0.9 + 0.012 = 2.118 kJ per use Comparison and conclusion: Plastic per-use energy: 45 kJ Reusable per-use energy: 2.118 kJ The reusable bottle is more energy-efficient per use under the given data. Limitations and notes: End-of-life energy for each option is spread across uses and may vary in real life. Washing energy assumes a constant per-use value; actual energy depends on washing practices. The conclusion depends on the assumed lifespan (500 uses) of the reusable bottle; different lifespans would change the result.",
    "notation": false
  },
  "y10-science-earth/exam-6-AQA-Higher": {
    "question": "Describe a GCSE model of how Earth’s atmosphere changed from early volcanic outgassing to the present. Explain the roles of cooling, oceans, carbon storage and photosynthesis. Explain why exact ancient gas percentages are uncertain.",
    "marks": 5,
    "markScheme": [
      "Volcanic outgassing contributed gases; the early atmosphere had much carbon dioxide and water vapour, with little or no free oxygen in the model.",
      "Cooling allowed water vapour to condense and oceans to form.",
      "Carbon dioxide dissolved in oceans and carbon became stored in carbonate rocks and organic deposits.",
      "Photosynthesis removed carbon dioxide and released oxygen, which eventually accumulated; nitrogen became the largest component.",
      "Modern dry air is approximately 78% nitrogen and 21% oxygen; ancient compositions are inferred from limited geological evidence rather than direct measurements."
    ],
    "answer": "In the GCSE model, volcanic gases contributed an early atmosphere rich in carbon dioxide and water vapour, with little free oxygen. Cooling allowed oceans to form. Carbon dioxide dissolved in water, and carbon was stored in carbonate rocks and organic deposits. Photosynthesis removed carbon dioxide and released oxygen, which accumulated over time and supported aerobic respiration. Modern dry air is about 78% nitrogen and 21% oxygen. Exact early percentages remain uncertain because scientists infer them from geological evidence.",
    "notation": false
  },
  "y10-science-earth/exam-8-AQA-Higher": {
    "question": "A life-cycle assessment (LCA) compares two packaging options for bottled water using cradle-to-grave carbon footprints measured in kilograms CO2e per bottle. The LCA provides the following data. Product A – PET plastic bottle: Manufacturing: 0.65 Transport: 0.10 Use: 0.05 End-of-life: 0.40 Product B – recyclable glass bottle: Manufacturing: 2.50 Transport: 0.25 Use: 0.04 End-of-life: 0.40 Calculate: (a) Total CO2e for Product A. (b) Total CO2e for Product B. (c) Which packaging has the lower carbon footprint per bottle and by how much? (d) Explain why the difference arises, with reference to at least two life-cycle stages. (e) Identify two limitations of this LCA and propose an improvement for each.",
    "marks": 6,
    "markScheme": [
      "1 mark: calculates A = 1.20 kg CO2e and B = 3.19 kg CO2e per bottle (both required).",
      "1 mark: identifies A as lower by 1.99 kg CO2e per bottle.",
      "1 mark: identifies manufacturing as the largest difference, 2.50 versus 0.65 kg CO2e.",
      "1 mark: compares transport, 0.25 versus 0.10 kg CO2e; accepts an accurate comparison of another stage.",
      "1 mark: identifies omission of other environmental impacts and proposes adding a relevant impact measure.",
      "1 mark: identifies limited reuse/recycling assumptions or functional equivalence and proposes modelling those scenarios or comparing equal delivered volumes."
    ],
    "answer": "Total CO2e for Product A = 0.65 + 0.10 + 0.05 + 0.40 = 1.20 kg CO2e per bottle. Total CO2e for Product B = 2.50 + 0.25 + 0.04 + 0.40 = 3.19 kg CO2e per bottle. Product A has the lower carbon footprint per bottle, by 1.99 kg CO2e (3.19 − 1.20 = 1.99 kg CO2e). Reason: The main difference comes from manufacturing emissions, where PET (0.65 kg CO2e) are far lower than glass (2.50 kg CO2e). The transport difference also contributes (0.10 vs 0.25 kg CO2e). The use phase is similar (0.05 vs 0.04 kg CO2e) and end-of-life is the same (0.40 kg CO2e). Limitations: This LCA only considers CO2e and does not account for other environmental impacts (e.g., water use, energy source, land use, toxicity). It also uses per-bottle data and fixed stage values that may not reflect real-world reuse or recycling rates. Improvements: Include additional impact categories beyond CO2e (e.g., water footprint, energy consumption, resource depletion) and model alternative scenarios such as bottle reuse/recycling cycles to capture how repeated use could change the total environmental impact.",
    "notation": false
  },
  "y10-science-earth/exam-9-AQA-Foundation": {
    "question": "Describe how Earth’s atmosphere is thought to have changed from its early volcanic origins to today. Include condensation and the oceans, removal of carbon dioxide, photosynthesis and accumulation of nitrogen. Explain the approximate present-day proportions of the two main gases.",
    "marks": 4,
    "markScheme": [
      "Describe volcanic gases, including carbon dioxide, water vapour and nitrogen, noting limited evidence for the early atmosphere.",
      "Explain that cooling condensed water vapour into oceans and carbon dioxide dissolved or became stored in carbonates.",
      "Explain that photosynthesis removed carbon dioxide and released oxygen.",
      "Explain gradual nitrogen accumulation and state the current approximate 78% nitrogen and 21% oxygen."
    ],
    "answer": "Evidence for the earliest atmosphere is limited, but one model proposes that volcanic activity released large amounts of carbon dioxide and water vapour, as well as nitrogen, with little or no free oxygen. As Earth cooled, water vapour condensed to form oceans. Carbon dioxide dissolved in water and became stored in carbonate sediments; later, photosynthesis also removed carbon dioxide and released oxygen. Nitrogen gradually accumulated because it is relatively unreactive. Today the air is approximately 78% nitrogen and 21% oxygen, with small amounts of other gases.",
    "notation": false
  },
  "y10-science-energy/practice-0-AQA-Foundation": {
    "question": "A 1200 W electric heater is switched on for 2 minutes 30 seconds to heat a room. 25% of the energy supplied is lost to the surroundings and does not heat the room. Calculate: (a) the total electrical energy supplied to the heater in kilojoules, (b) the energy that actually heats the room in kilojoules.",
    "hint": "Use energy transferred = power × time, then apply the 25% loss to find the part that heats the room.",
    "working": [
      "Convert time to seconds: 2 minutes 30 seconds = 150 s",
      "Compute energy supplied: E = P × t = 1200 W × 150 s = 180000 J",
      "Convert energy to kilojoules: 180000 J = 180 kJ",
      "Energy lost to surroundings: 25% of 180 kJ = 0.25 × 180 kJ = 45 kJ",
      "Energy that heats the room: 180 kJ − 45 kJ = 135 kJ"
    ],
    "answer": "a) Total electrical energy supplied: 180 kJ. b) Energy transferred usefully to heat the room in the stated model: 135 kJ.",
    "notation": false
  },
  "y10-science-energy/practice-9-Edexcel-Foundation": {
    "question": "A toy car of mass 0.25 kg moves at 2.0 m/s at the bottom of a ramp that rises 0.50 m. Take g = 9.8 N/kg and gravitational potential energy as zero at the bottom. Assume no friction or other energy losses and no motor supplying energy. (a) Calculate its initial kinetic energy. (b) Calculate the gravitational potential energy needed to reach the top. (c) Can the car reach the top? Explain using conservation of energy.",
    "hint": "Compare the energy initially available with the energy needed; do not add energies from different positions.",
    "working": [
      "Initial kinetic energy = 0.5 x 0.25 x 2.0² = 0.50 J.",
      "Potential energy needed at the top = 0.25 x 9.8 x 0.50 = 1.225 J, about 1.2 J.",
      "The total mechanical energy available remains 0.50 J. Since 1.225 J is needed, the car cannot reach the top under these assumptions."
    ],
    "answer": "(a) 0.50 J. (b) About 1.2 J is needed. (c) No: the initial 0.50 J is insufficient. Its energy is transferred from the kinetic store to the gravitational potential store as it climbs; the energies at two different positions must not be added.",
    "notation": false
  },
  "y10-science-infection/exam-7-Edexcel-Foundation": {
    "question": "A bacterium enters the body. Explain three ways white blood cells can defend the body, and explain why antibodies against a different pathogen might not recognise this bacterium.",
    "marks": 4,
    "markScheme": [
      "Some white blood cells ingest pathogens.",
      "White blood cells can produce antibodies that recognise particular antigens on pathogens.",
      "They can also make antitoxins that neutralise toxins.",
      "Antibodies are specific to particular antigens, so an antibody against a different antigen may not bind."
    ],
    "answer": "Some white blood cells ingest pathogens. White blood cells can produce antibodies that recognise particular antigens on pathogens. They can also make antitoxins that neutralise toxins. Antibodies are specific to particular antigens, so an antibody against a different antigen may not bind.",
    "notation": false
  },
  "y10-science-infection/exam-8-Edexcel-Foundation": {
    "question": "In a simplified, hypothetical teaching model, 1000 eligible people complete a vaccine course against a bacterial disease. Assume that, once their immune response has developed, 85% of these recipients are protected against illness and 5% experience mild temporary side effects. Separately, 800 people already infected receive an antibiotic; 90% recover as a result of this treatment. Calculate the expected numbers protected, experiencing side effects and successfully treated. Evaluate the different roles of vaccination and antibiotics. Explain why the calculated totals alone cannot establish which has the greater immediate effect on an outbreak, and identify a concern about unnecessary antibiotic use.",
    "marks": 6,
    "markScheme": [
      "1 mark: calculates $0.85 \\times 1000 = 850$ protected under the stated model.",
      "1 mark: calculates $0.05 \\times 1000 = 50$ experiencing mild side effects.",
      "1 mark: calculates $0.90 \\times 800 = 720$ successfully treated.",
      "1 mark: distinguishes vaccination preventing future illness after an immune response develops from antibiotics treating an existing bacterial infection.",
      "1 mark: explains that 850 and 720 concern different groups and timings, so the totals cannot rank immediate outbreak effects; exposure and transmission data are not supplied.",
      "1 mark: explains that unnecessary antibiotic use selects for resistant bacteria, potentially making future infections harder to treat."
    ],
    "answer": "Under this teaching model, 850 people would be protected after their immune response develops, 50 would experience mild temporary side effects, and 720 infected people would be successfully treated. Vaccination helps prevent future illness; antibiotics treat existing bacterial infections. Protection takes time to develop, and the two counts describe different groups and outcomes, so 850 being larger than 720 does not establish greater immediate outbreak control. The data do not quantify exposure or transmission. The approaches can complement each other. Unnecessary antibiotic use selects for resistant bacteria and may make subsequent infections harder to treat.",
    "notation": false
  },
  "y10-science-infection/exam-9-AQA-Higher": {
    "question": "Question 10. Describe the four main types of pathogens (bacteria, viruses, fungi, and protozoa) and, for each type, state one way in which pathogens of that type can spread from one person to another.",
    "marks": 4,
    "markScheme": [
      "1 mark: bacteria are single-celled organisms; an appropriate route such as contaminated food is given.",
      "1 mark: viruses reproduce inside host cells; an appropriate route such as respiratory droplets is given.",
      "1 mark: fungi include yeasts and multicellular forms; an appropriate route such as direct contact or contaminated surfaces for athlete's foot is given.",
      "1 mark: protozoa are single-celled eukaryotes; an appropriate route such as a mosquito vector for malaria is given."
    ],
    "answer": "Bacteria are single-celled organisms; some spread through contaminated food or water. Viruses reproduce inside host cells; some spread in respiratory droplets. Fungi include yeasts and multicellular forms; athlete's foot can spread through direct contact or contaminated surfaces. Protozoa are single-celled eukaryotes; the malaria pathogen passes between people through mosquito vectors. Routes depend on the particular pathogen, not just its broad group.",
    "notation": false
  },
  "y10-science-infection/practice-6-AQA-Foundation": {
    "question": "Compare bacteria, viruses and fungi as pathogens in terms of what they are, how they cause disease, and how infections are treated. Use simple, factual statements suitable for Foundation GCSE.",
    "hint": "Think about whether they are living cells or particles, how they harm body cells, and which medicines work against each type.",
    "working": [
      "Pathogenic bacteria are single-celled organisms; viruses replicate only inside host cells.",
      "Fungi are eukaryotic: yeasts are single-celled and moulds have networks of hyphae.",
      "Compare how pathogens damage tissues or cells, and distinguish treatment from prevention.",
      "Antibiotics act on bacteria, not viruses; antifungals and some antivirals have different targets."
    ],
    "answer": "Bacteria are single-celled organisms, usually with a cell wall; pathogenic kinds may damage tissues or produce toxins. Viruses are non-cellular particles that replicate inside host cells and can damage them. Fungi are eukaryotic organisms: yeasts are single-celled, while moulds form hyphae. Pathogenic fungi may grow on or invade tissues. Antibiotics kill susceptible bacteria or inhibit their growth; they do not treat viruses. Antifungal medicines treat fungal infections, and antivirals are available for some viral infections. Vaccines help prevent particular infections or reduce disease risk; they are not a treatment for an established infection.",
    "notation": false
  },
  "y10-science-infection/practice-7-AQA-Foundation": {
    "question": "A bacterium enters the body. Explain three ways white blood cells can defend the body, and explain why antibodies against a different pathogen might not recognise this bacterium.",
    "hint": "Identify the scientific principle, apply it to the information given and explain your conclusion.",
    "working": [
      "Some white blood cells ingest pathogens.",
      "White blood cells can produce antibodies that recognise particular antigens on pathogens.",
      "They can also make antitoxins that neutralise toxins.",
      "Antibodies are specific to particular antigens, so an antibody against a different antigen may not bind."
    ],
    "answer": "Some white blood cells ingest pathogens. White blood cells can produce antibodies that recognise particular antigens on pathogens. They can also make antitoxins that neutralise toxins. Antibodies are specific to particular antigens, so an antibody against a different antigen may not bind.",
    "notation": false
  },
  "y10-science-particles/practice-2-AQA-Foundation": {
    "question": "A fixed amount of gas in a rigid container is cooled. Explain the change in particle motion, pressure and internal energy.",
    "hint": "Identify the scientific principle, apply it to the information given and explain your conclusion.",
    "working": [
      "Cooling reduces the average kinetic energy, so particles move more slowly.",
      "Collisions with the walls become less frequent and less forceful, so pressure falls.",
      "The gas loses internal energy as energy is transferred to the surroundings."
    ],
    "answer": "Cooling reduces the average kinetic energy, so particles move more slowly. Collisions with the walls become less frequent and less forceful, so pressure falls. The gas loses internal energy as energy is transferred to the surroundings.",
    "notation": false
  },
  "y10-science-particles/practice-5-Edexcel-Foundation": {
    "question": "A fixed amount of gas in a rigid container is cooled. Explain the change in particle motion, pressure and internal energy.",
    "hint": "Identify the scientific principle, apply it to the information given and explain your conclusion.",
    "working": [
      "Cooling reduces the average kinetic energy, so particles move more slowly.",
      "Collisions with the walls become less frequent and less forceful, so pressure falls.",
      "The gas loses internal energy as energy is transferred to the surroundings."
    ],
    "answer": "Cooling reduces the average kinetic energy, so particles move more slowly. Collisions with the walls become less frequent and less forceful, so pressure falls. The gas loses internal energy as energy is transferred to the surroundings.",
    "notation": false
  },
  "y10-science-practicals/exam-3-AQA-Foundation": {
    "question": "Question 4 (Select apparatus with a suitable resolution). A plastic strip is about 7.5 cm long. You need to measure its length to the nearest 0.5 cm for a required practical. Choose the coarsest marked scale that still provides the required 0.5 cm resolution, and explain your choice. A) a ruler marked only at centimetre intervals (1 cm divisions) B) a ruler marked at centimetre and half-centimetre intervals (0.5 cm divisions) C) a ruler marked at millimetre intervals (0.1 cm divisions) D) a tape measure marked at centimetre intervals",
    "marks": 2,
    "markScheme": [
      "1st credit: Correctly identifies option B as giving the appropriate 0.5 cm resolution.",
      "2nd credit: Justifies that to measure to the nearest 0.5 cm for a 7.5 cm length, divisions every 0.5 cm are required (more coarse than this would not reliably show 0.5 cm; finer divisions are acceptable but not necessary)."
    ],
    "answer": "B is the coarsest listed scale with marks every 0.5 cm. Its divisions meet the required resolution. C also permits the measurement but has finer divisions than required.",
    "notation": false
  },
  "y10-science-practicals/exam-8-Edexcel-Foundation": {
    "question": "A pupil measures the length of a wooden rod using a ruler that has divisions of 0.5 cm. They record four readings: 28.0 cm, 28.5 cm, 27.5 cm and 28.0 cm. The pupil notices that when reading the ruler their eye is not always at the same level as the marking, which could lead to parallax error. Evaluate the uncertainty in the measured length and explain two practical ways to reduce it. State a best estimate for the length from the data and justify it using the readings. If a ruler with divisions of 0.1 cm is used, explain how this would affect the uncertainty.",
    "marks": 6,
    "markScheme": [
      "Identifies parallax error as a source of uncertainty in measurement.",
      "States one practical way to reduce uncertainty: read at eye level and align the ruler with the end of the rod.",
      "States a second practical way to reduce uncertainty: use a ruler with smaller divisions (e.g., 0.1 cm) to improve reading precision.",
      "Determines the best estimate from the data (average of readings) and justifies it using the range of values.",
      "Calculates or states the uncertainty as half the range derived from the readings.",
      "Explains that using a 0.1 cm ruler would decrease the uncertainty (greater reading precision)."
    ],
    "answer": "The mean is 28.0 cm. The readings span 27.5 to 28.5 cm, so half-range uncertainty is ±0.5 cm. Align the ruler carefully and view perpendicular to the scale to reduce parallax. A ruler with 0.1 cm divisions gives finer resolution: a common estimate is ±0.05 cm per scale reading, or up to ±0.1 cm for a length found by subtracting two readings. That does not automatically reduce the total experimental uncertainty to either value; alignment and repeatability still matter.",
    "notation": false
  },
  "y10-science-practicals/exam-8-Edexcel-Higher": {
    "question": "Question 9: A student carries out a density experiment for a small plastic block using a balance (precision ±0.01 g) and water displacement in a 100 cm^3 measuring cylinder (read to ±1 cm^3). The masses weighed three times are 25.34 g, 25.39 g and 25.31 g, and the corresponding volumes displaced are 9.0 cm^3, 9.1 cm^3 and 9.0 cm^3. a) Calculate the density for each measurement using density = mass/volume and give your answers to 2 decimal places with units g/cm^3. b) Identify two main sources of uncertainty in this method and explain how each would affect the density value. c) Suggest one practical improvement to reduce the uncertainty in your density result.",
    "marks": 6,
    "markScheme": [
      "Density from first measurement: 25.34 g / 9.0 cm^3 = 2.82 g/cm^3",
      "Density from second measurement: 25.39 g / 9.1 cm^3 = 2.79 g/cm^3",
      "Density from third measurement: 25.31 g / 9.0 cm^3 = 2.81 g/cm^3",
      "Uncertainty source: Mass measurement has a precision of ±0.01 g; this introduces a small uncertainty in density for each measurement (density changes roughly by ±0.01 g divided by the volume used).",
      "Uncertainty source: Volume measurement by water displacement read to ±1 cm^3; this has a larger effect on density because density is inversely proportional to volume; for masses around 25 g and volumes around 9 cm^3, a ±1 cm^3 error can noticeably change the calculated density.",
      "Improvement: Use a more precise volume-measuring method (for example a measuring instrument with a finer scale or a larger volume to reduce the relative effect of the reading) to reduce the uncertainty in the density result."
    ],
    "answer": "The densities are 2.82, 2.79 and 2.81 g/cm³ to two decimal places. Their mean, calculated from unrounded values, is about 2.81 g/cm³. The volume uncertainty is proportionally much larger than the balance uncertainty, so it dominates the density uncertainty. An overestimated volume gives an underestimated density, while an overestimated mass gives an overestimated density. Use a finer volume-measuring method and check for trapped air. The small spread of repeats does not prove that the instrument uncertainty is equally small.",
    "notation": false
  },
  "y10-science-practicals/practice-6-Edexcel-Higher": {
    "question": "In the following practical description, identify the independent variable, the dependent variable, and two controlled variables. A Year 10 student investigates how the extension of a spring changes when different masses are hung from it. The spring has a natural length of 5.0 cm when unloaded. The masses used are 50 g, 100 g, 150 g and 200 g. For each mass, the extension is read to the nearest 0.5 cm after allowing the spring to settle for 20 s. The student uses the same spring and a ruler marked in millimetres, and the room temperature is around 22°C.",
    "hint": "Think about what you deliberately change and what you measure.",
    "working": [
      "Independent variable: mass added, in grams.",
      "Dependent variable: spring extension, in centimetres.",
      "Keep the same spring and wait the same 20 seconds before each reading."
    ],
    "answer": "Independent variable: mass hung from the spring (g). Dependent variable: extension (cm), found by subtracting the unloaded length from the loaded length. Two controlled conditions are using the same spring and allowing the same 20-second settling time for each reading.",
    "notation": false
  },
  "y10-science-practicals/practice-9-AQA-Foundation": {
    "question": "A metal rod is about 12.5 cm long. You need to measure its length to the nearest 0.5 cm for a required practical. Which piece of apparatus is most suitable for this measurement from the following options: A) a 30 cm ruler marked in millimetres, B) a vernier caliper, C) a measuring cylinder?",
    "hint": "Think about how small a change you can read with each instrument.",
    "working": [
      "Step 1: The required precision is 0.5 cm, so the instrument must be able to resolve changes of at least 0.5 cm.",
      "Step 2: A 30 cm ruler with millimetre marks can read to the nearest 0.1 cm, which meets the requirement.",
      "Step 3: A vernier caliper can read to about 0.02 cm, which is more precise and still suitable.",
      "Step 4: A measuring cylinder is not suitable for measuring straight lengths, so it is not chosen."
    ],
    "answer": "A: the 30 cm ruler with millimetre markings. Its 0.1 cm resolution is sufficient for a measurement to the nearest 0.5 cm, and it readily spans the rod. A suitably sized caliper could also measure it, but its extra precision is unnecessary here.",
    "notation": false
  },
  "y11-computing-boolean-logic-and-translators/exam-8-AQA-core": {
    "question": "Compare compilation and interpretation. Discuss when translation happens, what is needed to run the program, execution speed, error reporting, portability and development. You may use native machine-code compilation and interpretation as the main comparison, but explain why Java bytecode is not itself a standalone native executable.",
    "marks": 6,
    "markScheme": [
      "1 mark: compilation translates source into target code before that target code is executed; the target may be machine code or intermediate code.",
      "1 mark: an interpreter executes source or intermediate instructions using a runtime interpreter.",
      "1 mark: native code can avoid interpretation overhead; actual speed also depends on implementation and optimisation.",
      "1 mark: compilers can report errors before execution; both approaches can still encounter runtime errors.",
      "1 mark: native binaries depend on the target platform, whereas portable source or bytecode needs a compatible runtime and dependencies.",
      "1 mark: explains a development trade-off or correctly distinguishes Java bytecode requiring a JVM from native machine code."
    ],
    "answer": "A compiler translates source into target code before that target is executed. A native compiler produces machine code for a particular platform; Java compilation usually produces bytecode that needs a compatible Java Virtual Machine. Compilation therefore does not always produce a standalone native executable.\n\nAn interpreter executes source or intermediate instructions through a runtime. Native code can avoid interpretation overhead, but optimisation and implementation also affect speed. Compilers can identify errors before execution; interpreted implementations may also check syntax before running, and both approaches can encounter runtime errors.\n\nA native binary depends on its processor, operating system and supporting dependencies. Source or bytecode can be portable where a compatible runtime exists. Interactive interpretation can make small experiments convenient, while a separate compilation step can provide checks and optimisation before distribution.",
    "notation": false
  },
  "y11-computing-boolean-logic-and-translators/practice-8-Edexcel-core": {
    "question": "Compare compilers and interpreters as types of translators used to convert high‑level programming languages (that may use Boolean logic) into executable form. Identify two similarities and two differences between them, and give one practical advantage for each approach in a realistic scenario (for example desktop software vs devices with different operating systems).",
    "hint": "Think about when the translation happens and how quickly the program runs.",
    "working": [
      "Both approaches help run high-level programs and can report errors.",
      "In a simplified comparison, compilation produces translated output before execution, while interpretation executes through an interpreter.",
      "A compiled executable and an interpreted program have different runtime requirements.",
      "Real systems can combine compilation, bytecode, interpretation and just-in-time compilation; speed and portability depend on implementation."
    ],
    "answer": "Two similarities: both support running programs written in a high-level language, and both can report problems in the program. Two differences in a simplified comparison: a compiler produces translated output before it is executed, while an interpreter executes through its runtime; a native executable is usually built for a target platform, while interpreted source requires a compatible interpreter on the target device. A compiler can provide efficient native execution for performance-sensitive software. An interpreter can make repeated testing convenient without a separate manual build step. Compiled output is not always native machine code, and interpreted systems are not invariably slower; many practical implementations combine techniques.",
    "notation": false
  },
  "y11-computing-computational-thinking-and-exam-skills/exam-8-AQA-core": {
    "question": "You are developing a small library-checkout module for a school library management system. The module will process a batch of up to 20 loan records. Each record contains three fields: student ID (a 6-digit integer), book ID (a 4-digit code), and a status field that is either Yes or No indicating whether the book has been returned. The program should (a) count how many records have returned = No, (b) provide the list of distinct student IDs who still have books on loan in ascending numerical order, and (c) give the positions (1-based) of records that are unreturned (where the status is No). Write a plan for an extended response that explains how you would approach designing, implementing, testing, and evaluating this component. Your plan should cover: problem restatement, inputs and outputs, constraints, overall approach (data structures and algorithms), a step-by-step plan or pseudocode, testing strategy with at least four test cases, edge cases you would consider, and how you would evaluate whether your solution meets the requirements.",
    "marks": 5,
    "markScheme": [
      "Identify the problem and outputs required.",
      "Identify inputs, constraints and data types.",
      "Describe the overall approach, including data structures and high-level algorithms.",
      "Provide a step-by-step plan or pseudocode for processing.",
      "Describe testing strategy with at least four test cases, plus edge cases and how to judge success."
    ],
    "answer": "Inputs: 0–20 records, each with a six-digit student ID, a four-character book code (store as text to preserve leading zeros), and exactly Yes or No for returned status. A book marked No is unreturned; due dates would be needed to establish that it is overdue. Initialise a count, an empty list of distinct student IDs, and an empty list of positions. Scan records in order, numbering positions from 1. For each No, increment the count, add the student ID if absent, and append the position. Sort the distinct IDs numerically before output. Four concrete tests: (1) empty batch → count 0 and empty lists; (2) one returned record for 123456 → count 0 and empty lists; (3) three records (234567, \"0001\", No), (123456, \"0002\", Yes), (234567, \"0003\", No) → count 2, IDs [234567], positions [1,3]; (4) 20 records all belonging to 123456 and all No → count 20, IDs [123456], positions 1 to 20. Also test invalid batch sizes, status values and malformed codes. Compare actual outputs with the expected values and check that codes retain leading zeros. The input is small; a clear scan and simple sort are adequate without formal complexity notation.",
    "notation": false
  },
  "y11-computing-computational-thinking-and-exam-skills/practice-8-AQA-core": {
    "question": "Question 9 — Plan an extended response for a GCSE AQA Computing task. Scenario: A small school library wants a simple program to search its catalogue by keyword and display matching book titles and authors. Plan an extended response that you would write in an exam to explain how you would design, implement and test this program. Your plan should include the following sections: aim, inputs and outputs, data structures, algorithm outline or pseudocode, testing, and evaluation/improvements. Use clear, concise language and explain your choices.",
    "hint": "Think about what the examiner needs to see: a logically ordered plan with justification for your design decisions.",
    "working": [
      "Step 1: Identify the required sections of the extended response.",
      "Step 2: Decide the order and language you will use to explain each section.",
      "Step 3: Plan how you will justify design choices (data structures, algorithm, testing).",
      "Step 4: Ensure the plan could be written within a GCSE 6–8 mark answer."
    ],
    "answer": "Aim: search a small catalogue and display each matching title and author once.\n\nInput: a non-empty search string. Data: a list of records with title, author and keyword-list fields. Output: matching titles/authors, or a no-match message. A linear search is simple and suitable for a small catalogue.\n\n```text\nterm = lowercase(trim(input()))\nIF term = \"\" THEN\n    OUTPUT \"Enter a search term\"\nELSE\n    matches = empty list\n    FOR EACH book IN catalogue\n        matched = contains(lowercase(book.title), term)\n                  OR contains(lowercase(book.author), term)\n        FOR EACH keyword IN book.keywords\n            IF contains(lowercase(keyword), term) THEN\n                matched = TRUE\n            ENDIF\n        NEXT keyword\n        IF matched THEN\n            APPEND book TO matches\n        ENDIF\n    NEXT book\n    IF length(matches) = 0 THEN\n        OUTPUT \"No matches found\"\n    ELSE\n        FOR EACH book IN matches\n            OUTPUT book.title, book.author\n        NEXT book\n    ENDIF\nENDIF\n```\n\nTest a title match, author match, keyword match, several matching fields in one record, multiple matching books, mixed case, no match and blank input. Expect one output per matching record, with original capitalisation preserved. Evaluate accuracy against the expected results. For a much larger catalogue, consider an index to reduce repeated searching.",
    "notation": false
  },
  "y11-computing-databases-and-sql/practice-0-AQA-core": {
    "question": "A small library management system stores data in three tables: Book, Member and Loan. The fields are as follows: Book: BookID, ISBN, Title, Author. BookID is a unique identifier for a book. ISBN is also unique and can be used as an alternative key. Member: MemberID, Name, Email. MemberID uniquely identifies a member. Loan: LoanID, BookID, MemberID, LoanDate, ReturnDate. LoanID uniquely identifies each loan. BookID in Loan is a foreign key referencing Book(BookID). MemberID in Loan is a foreign key referencing Member(MemberID). Identify: the primary keys for each table; all candidate keys established by the description, and which are alternative keys after selecting a primary key; the foreign keys and the tables they reference; the type of relationships between the tables (Book–Loan, Member–Loan, and the implied Book–Member relationship through Loan).",
    "hint": "Remember that keys identify records uniquely and foreign keys link related tables.",
    "working": [
      "Step 1: List the tables and the fields that uniquely identify a row in each table from the description.",
      "Step 2: Identify which fields are used to uniquely identify a row in each table (primary keys) and note any additional unique fields described (candidate keys).",
      "Step 3: Locate the foreign keys in the Loan table and state which tables they reference.",
      "Step 4: Determine the relationships: how Book relates to Loan and how Member relates to Loan, and what that implies for Book to Member.",
      "Step 5: Summarise the relationships between all three tables (including the mediated Book–Member relationship through Loan)."
    ],
    "answer": "Book candidate keys: BookID and ISBN. Choose BookID as primary key; ISBN is then an alternative key under the stated uniqueness assumption. Member candidate key and primary key: MemberID. Loan candidate key and primary key: LoanID. No other unique key is established for Member or Loan; do not assume Email or a date combination is unique.\n\nLoan.BookID references Book.BookID, and Loan.MemberID references Member.MemberID. Book–Loan and Member–Loan are one-to-many over time; Book–Member is many-to-many through Loan. In a real library with several physical copies of one edition, ISBN would not uniquely identify each copy, so that database would need a different copy/edition model.",
    "notation": false
  },
  "y11-computing-databases-and-sql/practice-3-AQA-core": {
    "question": "A student may enrol on the same course in different semesters, but at most once in any one semester. StudentID and CourseCode uniquely identify their respective parent records. A small college database uses three tables: Student, Course and Enrolment. The data are shown below. Identify the primary key for each table. Identify the foreign keys. Describe the relationships between the tables (including cardinality). Use the data provided to justify your answers. Student StudentID: 1001; Forename: Amy; Surname: Patel; Email: amy.patel@example.com StudentID: 1002; Forename: Ben; Surname: Clarke; Email: ben.clarke@example.com StudentID: 1003; Forename: Chloe; Surname: Singh; Email: chloe.singh@example.com Course CourseCode: CS101; CourseName: Computer Science; TeacherID: 200 CourseCode: CS102; CourseName: ICT Systems; TeacherID: 201 CourseCode: CS103; CourseName: Data Structures; TeacherID: 202 Enrolment StudentID: 1001; CourseCode: CS101; Semester: 2024S1 StudentID: 1001; CourseCode: CS102; Semester: 2024S1 StudentID: 1002; CourseCode: CS101; Semester: 2024S1 StudentID: 1003; CourseCode: CS103; Semester: 2024S1",
    "hint": "Think about what uniquely identifies a row in each table.",
    "working": [
      "Step 1: The primary key for the Student table is StudentID because each value is unique to a student.",
      "Step 2: The primary key for the Course table is CourseCode because each course has a unique code.",
      "Step 3: The primary key for the Enrolment table is the combination of StudentID, CourseCode and Semester, since a student can enrol in several courses and a single enrolment is defined by a student-course-semester combination.",
      "Step 4: Enrolment.StudentID is a foreign key referencing Student.StudentID; Enrolment.CourseCode is a foreign key referencing Course.CourseCode.",
      "Step 5: The relationships are: Student to Enrolment is one-to-many (one student can have many enrolments); Course to Enrolment is one-to-many (one course can have many enrolments); therefore Students and Courses have a many-to-many relationship via Enrolment."
    ],
    "answer": "Primary keys: Student table → StudentID; Course table → CourseCode; Enrolment table → (StudentID, CourseCode, Semester) composite key. Foreign keys: Enrolment.StudentID → Student.StudentID; Enrolment.CourseCode → Course.CourseCode. Relationships: Student 1-to-many Enrolment; Course 1-to-many Enrolment; overall Student and Course form a many-to-many relationship through Enrolment.",
    "notation": false
  },
  "y11-computing-databases-and-sql/practice-4-AQA-core": {
    "question": "Use SQLite syntax. Write a SQL query to list the first name, last name and year of study for every student who is enrolled in the 'Computer Science' course. The data should be returned in order of surname, then forename (i.e. last_name, then first_name). The table you will query is called Students and has the following columns: student_id (integer), first_name (text), last_name (text), course (text), year (integer), and gpa (decimal).",
    "hint": "Remember to filter by course name exactly as 'Computer Science' and to order by last_name, then first_name.",
    "working": [
      "Choose the columns to return: first_name, last_name, year.",
      "Use the Students table as the source data.",
      "Filter to include only rows where course = 'Computer Science'.",
      "Sort the results by last_name, then first_name; combine into the full SQL statement: SELECT first_name, last_name, year FROM Students WHERE course = 'Computer Science' ORDER BY last_name, first_name;"
    ],
    "answer": "```sql\nSELECT first_name, last_name, year\nFROM Students\nWHERE course = 'Computer Science'\nORDER BY last_name, first_name;\n```",
    "notation": false
  },
  "y11-computing-databases-and-sql/practice-7-Edexcel-core": {
    "question": "The database has a table named Players with columns PlayerID (integer), Name (text), Team (text), Goals (integer). The following records are present: 1, \"Alex Carter\", \"Lions\", 12 2, \"Sam Lee\", \"Tigers\", 9 3, \"Riya Patel\", \"Lions\", 15 4, \"Jordan Kim\", \"Tigers\", 7 5, \"Noah Singh\", \"Lions\", 5 Write an SQL query to return the Name and Goals of players who have scored more than 10 goals, showing the results in alphabetical order of Name.",
    "hint": "Filter on the Goals column and then sort the results by Name.",
    "working": [
      "Step 1: SELECT Name, Goals",
      "Step 2: FROM Players",
      "Step 3: WHERE Goals > 10",
      "Step 4: ORDER BY Name ASC"
    ],
    "answer": "```sql\nSELECT Name, Goals\nFROM Players\nWHERE Goals > 10\nORDER BY Name ASC;\n```\nResults: Alex Carter, 12; Riya Patel, 15.",
    "notation": false
  },
  "y11-computing-databases-and-sql/practice-9-Edexcel-core": {
    "question": "A student may take the same course in different years, but at most once per year. student_id and course_code uniquely identify their respective parent records. 10 Identify the keys and relationships in the following database with three tables and sample data: STUDENTS(student_id, name, class); COURSES(course_code, course_name); ENROLMENTS(student_id, course_code, year). The sample data is: STUDENTS: S001 Alice Carter 11A; S002 Ben Patel 11A; S003 Chloe Hughes 11B. COURSES: C101 Mathematics; C102 Physical Education; C103 Computer Science. ENROLMENTS: S001 C101 2024; S001 C103 2024; S002 C101 2024; S003 C102 2024. For each table, state the primary key; identify any foreign keys in ENROLMENTS; and describe the relationships between STUDENTS and ENROLMENTS, and between COURSES and ENROLMENTS. Finally, state what overall relationship exists between STUDENTS and COURSES through ENROLMENTS.",
    "hint": "Think which field would uniquely identify a row in each table.",
    "working": [
      "Step 1: The primary key for STUDENTS is student_id because it uniquely identifies each student.",
      "Step 2: The primary key for COURSES is course_code because it uniquely identifies each course.",
      "Step 3: The primary key for ENROLMENTS is the combination (student_id, course_code, year) to ensure each enrolment row is unique for a student in a given course and year.",
      "Step 4: ENROLMENTS has a foreign key student_id that references STUDENTS.student_id.",
      "Step 5: ENROLMENTS has a foreign key course_code that references COURSES.course_code.",
      "Step 6: The relationship between STUDENTS and ENROLMENTS is one-to-many: a single student can appear in many enrolments.",
      "Step 7: The relationship between COURSES and ENROLMENTS is one-to-many: a single course can appear in many enrolments.",
      "Step 8: Therefore, the overall relationship between STUDENTS and COURSES, as shown by ENROLMENTS, is many-to-many."
    ],
    "answer": "STUDENTS: primary key = student_id COURSES: primary key = course_code ENROLMENTS: primary key = (student_id, course_code, year); foreign keys = student_id -> STUDENTS(student_id); course_code -> COURSES(course_code) Relationships: STUDENTS to ENROLMENTS is one-to-many; COURSES to ENROLMENTS is one-to-many; overall STUDENTS to COURSES is many-to-many via ENROLMENTS",
    "notation": false
  },
  "y11-computing-ethical-legal-and-environmental-impacts/exam-1-AQA-core": {
    "question": "A school uses a learning platform that collects data from students — including usernames, posts in discussion forums, location data from school Wi‑Fi, and device IDs — to train an automated moderation and recommendation system. The platform stores this data for 12 months and may share anonymised data with third‑party educational tools. Some teachers report that posts by students who use regional dialects or non‑standard spelling are more often flagged as inappropriate than posts by other students. The platform states this helps keep the online space safe but raises privacy concerns and potential bias. Analyse privacy and bias in this scenario, and outline two improvements to protect privacy and reduce bias.",
    "marks": 6,
    "markScheme": [
      "Identifies privacy concerns from collecting personal data (usernames, posts, location data, device IDs) and the need for an appropriate lawful basis, clear information and data minimisation",
      "Explains that data is stored for 12 months and may be shared with third‑party tools, highlighting risks and the need for clear policies",
      "Identifies bias in the moderation system where dialects or non‑standard spellings are more likely to be flagged",
      "Explains how such bias can lead to unfair treatment and negative impacts on students",
      "Outlines a privacy improvement such as data minimisation, an appropriate lawful basis, clear notices, justified retention and handling of applicable data rights",
      "Outlines a bias‑reduction improvement such as diverse training data, ongoing bias checks, human review for ambiguous cases, and an appeals process"
    ],
    "answer": "Collecting posts, device IDs and Wi-Fi location data creates privacy risks, especially if the information is linked to identifiable children. The school and provider should establish their roles and an appropriate lawful basis, give clear age-appropriate information, minimise data, justify retention and check any sharing arrangements. Consent is not automatically the correct basis, and requests for erasure depend on the circumstances. Calling shared data anonymised is insufficient if people can still be identified. The reported higher flag rate for regional dialects suggests possible bias that needs investigation. Improvement one: collect only data needed for defined purposes, restrict access and sharing, and apply justified deletion schedules. Improvement two: test performance across language varieties, improve representative training data, provide human review and allow learners to challenge decisions.",
    "notation": false
  },
  "y11-computing-ethical-legal-and-environmental-impacts/exam-7-Edexcel-core": {
    "question": "Question 8 (Edexcel GCSE Computing, Ethical, Legal and Environmental Impacts — Analyse privacy and bias). A fictional mobile app called Pulse is used by 50,000 users in the UK to personalise content. Pulse collects or records the following data: age 13–17, location (city or town), interests from a list (Football, Music, Gaming, Art, Science, Cooking), device type (Smartphone or Tablet), and daily time spent on the app (0–180 minutes). Pulse uses this data to tailor the content shown and the advertisements displayed. The privacy policy states data may be shared with third‑party advertisers for targeted ads, and users can adjust privacy settings to limit data sharing. Data is stored for 12 months before deletion. Analyse privacy and bias in this system. In your answer, discuss what personal data is collected, the privacy implications, how consent is obtained and whether it is appropriate for users aged 13–17, potential biases in the data and in the personalised content, and practical measures to reduce privacy risk and bias.",
    "marks": 6,
    "markScheme": [
      "Identifies the personal data collected and explains why this raises privacy concerns.",
      "Evaluates consent and age considerations for users aged 13–17, and discusses third‑party data sharing.",
      "Considers data retention and security, and suggests improvements to protection and access controls.",
      "Analyses potential biases in the data and how these biases could affect the personalised content or opportunities for different user groups.",
      "Proposes practical measures to reduce privacy risk and bias (e.g., data minimisation, user control over settings, anonymisation/aggregation, clear privacy notices, and regular reviews).",
      "Draws a balanced conclusion about the ethical and legal implications of the system."
    ],
    "answer": "Age, town, interests, device type and usage history can combine into a detailed profile, even without a name. Sharing with advertisers increases the range of recipients and purposes; a twelve-month period needs a reason and reliable deletion, not merely a promise. The scenario does not describe how consent is obtained, so consent cannot be assumed from signing up or reading a privacy policy.\n\nWhere a UK online service offered directly to children relies on consent, the relevant age threshold is 13; below that, parental authorisation is required. Being 13 or older does not automatically make consent informed or every use fair. ICO guidance expects children’s profiling options to be off by default unless there is a compelling reason taking account of their best interests.\n\nBias could arise from unrepresentative users or from a recommendation loop that keeps showing the same topics. Test outcomes across groups and allow interests to be corrected or reset. Minimise collection, explain purposes in age-appropriate language, restrict sharing and access, and check retention and deletion. These safeguards reduce risk; the scenario is insufficient to declare the system legally compliant. Sources: ICO, Children and the UK GDPR; Children’s Code, Profiling.",
    "notation": false
  },
  "y11-computing-ethical-legal-and-environmental-impacts/practice-8-AQA-core": {
    "question": "A secondary school with 480 pupils in Years 9–11 is considering adopting a new learning analytics app. The app will collect daily data on login time (hour of day), pages visited, and quiz scores to personalise resources for students. The provider states that data will be stored in the cloud and kept for 2 years, and that anonymised data may be shared with research partners. The school must decide whether to adopt the app. Using only the information provided, reach a justified conclusion about whether the school should adopt the app. In your answer, identify at least one ethical consideration, one legal consideration and one environmental impact, and give your main reason for your conclusion.",
    "hint": "Distinguish possible benefits from evidence still needed about privacy, lawful processing and resource use.",
    "working": [
      "Personalisation could help learning, but the scenario does not establish its effectiveness.",
      "Tracking pupils raises questions of privacy, fairness and how results could affect them.",
      "The school needs an appropriate lawful basis, transparent information and a justified retention period; parental consent is not a universal requirement for every school use.",
      "Cloud computing uses energy and equipment, but no energy figures are supplied, so a numerical footprint or cost cannot be calculated.",
      "A defensible conclusion is to seek evidence and safeguards before adoption, with a limited evaluation if justified."
    ],
    "answer": "I would not approve full adoption on this information alone. The school should establish an appropriate lawful basis, explain the monitoring clearly, justify retention and check security and any claimed anonymisation. It should also test whether the app improves learning fairly. Cloud infrastructure has environmental impacts, but the supplied information cannot quantify them. A properly governed evaluation could inform a later decision.",
    "notation": false
  },
  "y11-computing-ethical-legal-and-environmental-impacts/practice-9-Edexcel-core": {
    "question": "A local secondary school is planning to run an online sports club register. The register will store personal data for 150 pupils, including full name, date of birth, home address, parent/guardian email, and a small portrait photograph used for club publicity. The data will be stored on a cloud service based in the UK and can be accessed by the club coaches on school devices. The school intends to share some of this data with a third‑party app that handles consent forms and attendance records. Explain which laws apply to the collection, storage and sharing of this data, and outline the steps the school should take to comply.",
    "hint": "Think about data protection rules for schools, consent for pupils, and agreements with the cloud provider.",
    "working": [
      "UK GDPR and the Data Protection Act 2018 govern the handling of this personal information.",
      "Identify a lawful basis for each purpose. Public task may support a public school’s necessary functions; optional publicity photographs need a separate assessment and may use valid consent.",
      "Establish each organisation’s actual role. A provider acting only on school instructions is a processor and needs the appropriate contract; a third party deciding its own purposes may be a separate controller.",
      "Give accessible privacy information to pupils and parents, minimise data, keep it accurate and restrict access to authorised staff.",
      "Apply appropriate security and assess any restricted international transfers; UK hosting alone does not establish all compliance.",
      "Set justified retention periods for each record type, considering applicable obligations, and support data-subject rights."
    ],
    "answer": "UK GDPR and the Data Protection Act 2018 apply. The school must identify a lawful basis for each purpose, rather than assume parental consent covers everything. Necessary school functions and optional publicity may need different assessments. Collect only necessary data, provide clear notices, use appropriate security and establish the actual roles of the cloud and app providers, with processor contracts where applicable. Retention should reflect purpose and relevant obligations. These steps support compliance; the limited scenario does not prove it.",
    "notation": false
  },
  "y11-computing-operating-systems-and-utilities/practice-6-AQA-core": {
    "question": "A pupil runs a browser, a word processor and a media player at the same time. Explain how the operating system manages processor time and memory. Describe how using virtual memory can help when RAM is under pressure and why performance may become slower.",
    "hint": "Distinguish scheduling processor time, allocating RAM and using secondary storage as virtual memory.",
    "working": [
      "The operating system allocates processor time to runnable processes, allowing several applications to make progress.",
      "It allocates and tracks areas of RAM and helps prevent processes accessing memory that belongs to others.",
      "Virtual memory can move less-used data between RAM and secondary storage when needed.",
      "Secondary storage is slower to access than RAM, so frequent transfers can reduce responsiveness."
    ],
    "answer": "The operating system schedules processor time between runnable processes and saves enough state to resume each process later. It allocates and tracks RAM for applications and protects their memory areas. Virtual memory allows some data to be held on secondary storage and transferred into RAM when required. This can help applications continue when RAM is limited, but frequent transfers are slower than accessing data already in RAM, so the computer may become less responsive.",
    "notation": false
  },
  "y11-computing-operating-systems-and-utilities/practice-6-Edexcel-core": {
    "question": "A pupil runs a browser, a word processor and a media player at the same time. Explain how the operating system manages processor time and memory. Describe how using virtual memory can help when RAM is under pressure and why performance may become slower.",
    "hint": "Distinguish scheduling processor time, allocating RAM and using secondary storage as virtual memory.",
    "working": [
      "The operating system allocates processor time to runnable processes, allowing several applications to make progress.",
      "It allocates and tracks areas of RAM and helps prevent processes accessing memory that belongs to others.",
      "Virtual memory can move less-used data between RAM and secondary storage when needed.",
      "Secondary storage is slower to access than RAM, so frequent transfers can reduce responsiveness."
    ],
    "answer": "The operating system schedules processor time between runnable processes and saves enough state to resume each process later. It allocates and tracks RAM for applications and protects their memory areas. Virtual memory allows some data to be held on secondary storage and transferred into RAM when required. This can help applications continue when RAM is limited, but frequent transfers are slower than accessing data already in RAM, so the computer may become less responsive.",
    "notation": false
  },
  "y11-computing-problem-solving-mastery/practice-7-AQA-core": {
    "question": "8 In a Year 11 GCSE Computing task on Implement robust solutions, describe how you would ensure a simple program that calculates the area of a rectangle handles invalid input and continues to run. The program reads length and width in centimetres and prints the area in square centimetres. For calculation, use length = 12.5 cm and width = 9.0 cm. What will be the area printed by the program, with the correct units?",
    "hint": "Handle invalid conversions and reject zero or negative dimensions before multiplying.",
    "working": [
      "Read a dimension and attempt to convert it to a number.",
      "Reject the input if conversion fails, if the value is not finite, or if the value is less than or equal to zero. Show a clear message and ask again.",
      "Repeat the check independently for the second dimension.",
      "Calculate 12.5 x 9.0 = 112.5 and display square-centimetre units."
    ],
    "answer": "Use a loop for each dimension. Catch numeric-conversion errors and reject empty, non-numeric, zero, negative or non-finite values, then explain the problem and prompt again instead of terminating. Only calculate when both dimensions are valid. Test normal decimals, letters, blank input, zero and a negative value. With length 12.5 cm and width 9.0 cm, the output is 112.5 cm².",
    "notation": false
  },
  "y11-design-technology-design-decisions-and-exam-practice/exam-0-AQA-core": {
    "question": "A compact desk clamp lamp is designed for students to illuminate their writing area. The lamp has a plastic ABS body with a 22.0 cm long metal neck, a clamp that fits desks up to 2.5 cm thick, a lamp head of 6.0 cm diameter, a total extended height of 26.0 cm, a base width of 9.5 cm and a base depth of 6.0 cm. It weighs 520 g. It uses a 5 W LED with a colour temperature of 4000 K and is powered from a 230 V mains supply via a 1.5 m flexible cord with a safety switch on the base. The head can pivot through 90 degrees and the neck can rotate 180 degrees. The LED is rated for 25,000 hours. If used for 8 hours a day, energy use is 0.04 kWh per day. The target user is a student who needs even lighting and the ability to adjust the light angle easily while seated at a desk. Analyse the design decisions in this product, explain how they meet user needs, identify potential weaknesses, and propose one improvement with justification.",
    "marks": 5,
    "markScheme": [
      "Identifies at least two design decisions (e.g., desk clamp, neck/pivot joints, LED choice, power/safety features) and explains how they meet user needs.",
      "Explains how the lighting specification (5 W, 4000 K, long life) supports task lighting and energy efficiency.",
      "Evaluates potential weaknesses (cord length, weight/base stability, joint wear) and their impact on use.",
      "Proposes a realistic improvement that could be implemented.",
      "Justifies the improvement with benefits and any trade-offs."
    ],
    "answer": "The clamp can save desk space and the adjustable neck and head let the user aim the light. Check that the clamp fits the actual desk: its maximum thickness is 2.5 cm. A 5 W LED uses 0.04 kWh in eight hours, while 4000 K describes colour temperature; neither proves adequate brightness or even illumination, which need light-output and illuminance testing. The 25,000-hour figure is a stated rating, not a guarantee. Potential weaknesses include a short cord for some sockets, joint wear and inadequate clamp grip; a clamp-mounted lamp’s security depends on its mounting rather than simply its base dimensions. Add a lockable joint to hold the chosen angle, then test adjustment force and loaded stability; this adds cost and an extra adjustment step.",
    "notation": false
  },
  "y11-design-technology-design-decisions-and-exam-practice/exam-0-Edexcel-core": {
    "question": "A 500 ml stainless steel insulated bottle has the following specifications: height 26.5 cm, body diameter 6.5 cm, empty weight 180 g, outer finish powder-coated, double-wall vacuum insulation, plastic screw cap with silicone seal. The bottle is designed for everyday use by Year 11 students to carry drinks to school. Analyse how the design features listed (materials, insulation, dimensions, finishing and assembly) meet the needs of the user group in terms of durability, portability, hygiene and sustainability. Use the given specifications to support your analysis",
    "marks": 4,
    "markScheme": [
      "Explain how a vacuum between walls reduces conduction and convection across that gap.",
      "Relate stainless steel and the cap seal to intended durability and leak resistance, with testing needed.",
      "Use the supplied dimensions and mass to discuss portability without assuming every bag pocket fits.",
      "Discuss cleaning, repeated use and separation of materials, recognising that recycling acceptance varies."
    ],
    "answer": "The vacuum gap reduces conduction and convection between the walls, helping slow temperature change, although heat can still transfer through the cap and other paths. Stainless steel is suitable for repeated use; the silicone seal is intended to resist leaks, which needs testing. The coating may improve handling depending on its texture, but this is not established by powder coating alone. At 26.5 cm high and 6.5 cm diameter, the bottle needs a bag-fit check; 180 g is its empty mass, so a filled bottle is heavier. Cleaning access and removable seals matter for hygiene. Reuse can reduce disposable-container demand, while end-of-life recovery depends on separating the steel, plastic and silicone and finding suitable collection routes.",
    "notation": false
  },
  "y11-design-technology-design-decisions-and-exam-practice/exam-3-Edexcel-core": {
    "question": "A desk-tidy brief requires all stored items, including a rigid 30 cm ruler, to fit entirely inside an 18 cm × 9 cm × 6 cm envelope. It must also hold pens, pencils, scissors, an eraser and a phone. Explain why the ruler requirement conflicts with the size limit. Propose a revision to agree with the client, outline a concept after that revision, and describe tests for fit, stability, cleaning, sustainability and a target cost under £2 per unit for 200–500 units. Distinguish a proposed design from proven compliance.",
    "marks": 6,
    "markScheme": [
      "Identifies that a rigid 30 cm ruler cannot fit entirely inside the stated envelope.",
      "Explains that even the longest diagonal is only 21 cm, or gives equivalent sound geometric reasoning.",
      "Proposes agreeing a changed requirement, such as allowing stored items to project above the organiser.",
      "Outlines a plausible concept with dimensions and materials, acknowledging fit and stability tests.",
      "Addresses sustainable sourcing, cleaning, batch manufacture and costing without claiming the £2 target is established.",
      "Gives specific evaluation checks against the revised brief."
    ],
    "answer": "The longest straight line inside the envelope is its space diagonal: √(18² + 9² + 6²) = 21 cm. A rigid 30 cm ruler cannot be fully enclosed. Agree with the client that 18 × 9 × 6 cm limits the empty organiser, while stored items may project vertically. After that revision, prototype a 17.5 × 8.5 × 5.5 cm body with divided upright pockets, a narrow upright ruler slot and a shallow eraser tray. Determine pocket sizes from the actual items and allow for wall thickness; the layout remains a proposal until tested. A responsibly sourced plywood prototype could be cut and assembled in small batches with sealed rounded edges and non-slip feet. Check loaded stability, simultaneous fit, access and cleaning. Compare material yield, joints, labour and purchased feet when costing 200–500 units: the £2 target is not yet demonstrated. Revise the layout or brief if tests fail.",
    "notation": false
  },
  "y11-design-technology-design-decisions-and-exam-practice/exam-5-AQA-core": {
    "question": "You are designing a desk organiser made from recycled polypropylene for Year 11 Design Technology. The brief requires a compact organiser that sits on a desk area 30 cm wide. Finished dimensions: width 30 cm, depth 9 cm, height 7 cm. It must hold five to seven pens, a pair of scissors (14 cm long), a ruler (30 cm long), a small notepad A7 size (105 × 74 mm), and a pad of sticky notes. The product should be assessed for possible injection moulding in small batches, with a target production cost under £2 per unit, and be robust for use over at least two years. You must produce an extended, structured answer that explains and justifies design decisions, evaluates alternatives, and includes a plan for testing and evaluation. Structure your answer with an introduction, sections on material/method choice, layout/ergonomics, alternative materials, testing plan, and a concise conclusion. Use clear, well organised paragraphs and appropriate technical vocabulary. Do not refer to any diagrams. Use only information in this brief; do not assume any values not stated above.",
    "marks": 6,
    "markScheme": [
      "Clearly links the design decisions to the brief, identifying user needs and constraints (size, capacity, cost, durability).",
      "Justifies the material choice (recycled polypropylene) with reasons relating to durability, maintenance, cost, and sustainability.",
      "Justifies the manufacturing method (injection moulding) and evaluates tooling costs against batch size and integrated features.",
      "Explains layout/ergonomics and dimensions in relation to the specified items (pens, scissors, ruler, notepad, sticky notes) and safety considerations (rounded edges, stability).",
      "Evaluates at least one alternative material or approach and provides a reasoned rationale for favouring the chosen option.",
      "Describes a practical testing plan to verify fitness for purpose (functional checks, durability, ease of use, and user feedback) and how results would inform final design."
    ],
    "answer": "The organiser must fit a 30 × 9 × 7 cm envelope and hold the listed items. Recycled polypropylene is a plausible tough, moisture-resistant material, but grade, recycled content and durability require checking. Injection moulding can produce repeatable integrated pockets; its tooling cost may make small batches uneconomic. Obtain a quotation before claiming the £2 target can be met, and compare fabricated sheet material or other prototyping routes. Use shallow open pockets within the 7 cm body height, allowing pens and scissors to project above the body. A 30 cm ruler would need an open-ended support groove, since end walls reduce the available internal length; confirm that projection is acceptable. The stated 105 × 74 mm notepad is A7, not A6; allow clearance and wall thickness when arranging its tray. Avoid claiming a complete layout until all items fit simultaneously in a full-size prototype. Round edges and test stability, access, cleaning, impact resistance and repeated use. Compare supplier evidence, waste, repair and recycling options. Record actual material, tooling and labour costs, and revise the design if cost or fit tests fail.",
    "notation": false
  },
  "y11-design-technology-design-decisions-and-exam-practice/exam-7-AQA-core": {
    "question": "You are designing a compact desk organiser for stationery to be used by a Year 11 student. The finished item has outer dimensions length 22.0 cm, width 9.0 cm, height 8.0 cm and is built from 6 mm birch plywood with a 2 mm clear acrylic front panel. The front panel contains: a pen holder cavity 2.0 cm wide by 6.0 cm tall, located 2.0 cm from the left edge; a sticky-note slot 3.0 cm wide by 4.0 cm tall, located 2.0 cm from the right edge; a central display window 5.0 cm wide by 3.5 cm tall. The design uses interlocking tab-and-slot joints along the top and bottom edges to enable assembly without tools; the bottom front edge includes a 1.0 mm chamfer to ease sliding onto a desk. In a sketch you would show two views (front elevation and a cross-section) with annotations. Describe, as a \"sketch communicated solution\", how you would present this organiser. In your answer, cover: two views you would show and why; the key features to annotate (include the exact dimensions for pen holder, sticky-note slot, and display window, and their positions); how you would illustrate the tab-and-slot assembly and the chamfer; the reason for material choices and what this adds to the design; one improvement you would consider if you had more time.",
    "marks": 6,
    "markScheme": [
      "1 mark: Name two views (front elevation and a cross-section) to communicate both plan and depth.",
      "1 mark: Annotate pen holder with width 2.0 cm and height 6.0 cm, located 2.0 cm from the left edge (and state depth as appropriate).",
      "1 mark: Annotate sticky-note slot with width 3.0 cm and height 4.0 cm, located 2.0 cm from the right edge.",
      "1 mark: Annotate display window with width 5.0 cm and height 3.5 cm.",
      "1 mark: Describe how the tab-and-slot assembly would be shown (top and bottom edges) and how the 1.0 mm chamfer would be represented.",
      "1 mark: Give a reason for material choices (6 mm plywood for body; 2 mm acrylic for front) and what this adds to the design, plus one feasible improvement."
    ],
    "answer": "Two views chosen: front elevation and a cross-section (side view). The front elevation shows the overall layout of features along the length (pen holder, sticky-note slot, display window and the front panel) while the cross-section reveals the thicknesses of materials (6 mm plywood body and 2 mm acrylic front panel) and how the parts fit together. Pen holder: annotate a cavity 2.0 cm wide and 6.0 cm tall on the front panel, located 2.0 cm from the left edge. The cavity depth is not specified. Mark it as a dimension to establish rather than inventing a value; the 2 mm panel thickness is a separate measurement. Sticky-note slot: annotate a slot 3.0 cm wide by 4.0 cm tall, located 2.0 cm from the right edge. Indicate its position along the length of the front panel (towards the right) and its height from the bottom edge (consistent with the 8.0 cm total height). Display window: annotate a central display window 5.0 cm wide by 3.5 cm tall on the acrylic front panel. Place this roughly at the horizontal midpoint of the 22.0 cm length to show a label or image behind the panel. Tab-and-slot assembly: indicate tabs running along the top and bottom edges of the front panel that fit into slots in the body to achieve tool-free assembly. Represent the slots in the body with corresponding openings and a note that alignment lugs ensure correct assembly direction. The 1.0 mm chamfer along the bottom front edge would be shown as a small bevel line at the bottom front, indicating how it removes the sharp edge; check that the chamfer remains compatible with material thickness. Materials justification: body made from 6 mm birch plywood provides rigidity, edge strength, and ease of cutting; 2 mm clear acrylic front panel gives a transparent display, allowing users to see contents or information behind the panel. This combination supports durability (plywood) with a clean, attractive presentation (acrylic) and enables simple, tool-free assembly via tabs and slots. One improvement: add adjustable internal dividers or modular inserts to accommodate different amounts of stationery, or consider magnetic or snap-fit features to further improve ease of disassembly and reassembly for transport or reconfiguration.",
    "notation": false
  },
  "y11-design-technology-design-decisions-and-exam-practice/practice-6-Edexcel-core": {
    "question": "Analyse a product. The following product is a reusable 650 ml stainless steel insulated bottle designed for use at school. Its outer diameter is 70 mm and the outer height is 240 mm. The stainless steel walls are 0.4 mm thick, with an approximately cylindrical usable inner cavity 62 mm in diameter and 215 mm high, allowing space for two walls, a vacuum gap, base and closure, giving a nominal capacity of about 650 ml. The bottle uses vacuum double-wall insulation, has a blue powder-coated finish, and a BPA-free plastic screw-cap with a silicone O-ring to seal. The outer shell is formed by stamping, the inner liner is inserted, and the base is welded; the cap assembly is then fitted. Analyse how the design features meet the needs of a pupil who carries the bottle in a school bag, considering factors such as portability, durability, leak resistance, hygiene, temperature retention, and environmental impact. Then propose two improvements and justify how they would address cost, weight, durability or sustainability.",
    "hint": "Focus on how each feature helps or hinders use in a bag and during the school day.",
    "working": [
      "Relate the double-wall vacuum gap to reduced heat transfer and the outer size to portability.",
      "Treat the O-ring as a sealing feature whose performance must be tested.",
      "Compare durability and cleanability, including access to the neck and removable seal.",
      "Propose verified recycled content and replaceable cap/seal parts, checking quality and local end-of-life routes."
    ],
    "answer": "The approximately cylindrical usable cavity gives about 649 ml, consistent with a nominal 650 ml capacity. The larger 70 mm outer diameter leaves space for two metal walls and a vacuum gap; cavity height is less than overall height because the base and closure also take space. Vacuum insulation reduces heat transfer, while stainless steel can withstand routine use but may dent. The screw cap and O-ring aim to prevent leaks; this requires testing, not assumption.\n\nCheck whether the neck allows cleaning and whether the seal can be removed safely. Verified recycled steel content could reduce demand for new material, subject to the grade and manufacturing process. A replaceable cap and seal could extend service life. Neither silicone nor every coating is accepted in ordinary recycling, so design for separation and confirm collection routes rather than claiming the entire bottle is fully recyclable.",
    "notation": false
  },
  "y11-design-technology-design-decisions-and-exam-practice/practice-9-Edexcel-core": {
    "question": "A compact insulated school lunch box has the following details: outer length 18.0 cm, outer width 12.5 cm, outer height 5.0 cm; interior capacity 800 ml; container material is BPA-free polypropylene; the lid is hinged and has a silicone gasket to prevent leaks; the lunch box weighs 190 g; the lid can be removed before microwaving; the lunch box is dishwasher-safe on the top rack; packaging uses recyclable cardboard. Analyse how these design decisions (dimensions, materials, lid design and packaging) affect usability, safety and environmental impact for a student in Year 11.",
    "hint": "Think about how the lid seal affects leakage and the size impacts bag fit and weight.",
    "working": [
      "The stated 800 ml usable capacity and 190 g mass inform portability, but actual meal and bag fit need checking.",
      "External dimensions do not equal internal capacity because walls and insulation occupy space.",
      "The gasket is intended to reduce leaks; test the assembled lid and hinge after repeated use.",
      "BPA-free alone does not establish suitability for every food or temperature. Follow the product’s verified intended-use instructions.",
      "Recyclable packaging needs an accepting collection route; consider the whole product and repeated use."
    ],
    "answer": "The compact outer dimensions and 190 g empty mass may suit a school bag, but test actual fit and whether the 800 ml internal capacity meets users’ needs. A hinged lid reduces the chance of losing it, while the gasket is intended to resist leaks; wear and closure force require testing. BPA-free polypropylene alone does not establish microwave suitability. Removing the lid is insufficient unless the manufacturer confirms that the container is suitable for the intended heating conditions. Follow verified dishwasher and food-contact instructions. Cardboard packaging may be recyclable where accepted, but overall environmental benefit also depends on durability, cleaning and repeated use.",
    "notation": false
  },
  "y11-design-technology-materials-processes-and-manufacture/exam-1-AQA-core": {
    "question": "You are designing a protective tablet case from high-impact polystyrene (HIPS) pellets to produce nominal 2 mm wall thickness. The case needs to be produced in batches of 500 units, with a smooth outer surface and a snap-fit lid that secures shut. Assume suitable mould tooling is already available. From the following forming processes, identify the most appropriate process to manufacture the lid and justify your choice with two reasons: injection moulding, vacuum forming, thermoforming, rotational moulding.",
    "marks": 3,
    "markScheme": [
      "1 mark: selects injection moulding under the stated tooling assumption.",
      "1 mark: links moulded detail and repeatable dimensions to the snap-fit features.",
      "1 mark: links a smooth, repeatable surface to the cavity finish; accepts another appropriate explained reason."
    ],
    "answer": "Injection moulding, using the available tooling. It can form detailed snap-fit features with repeatable dimensions and reproduce the mould cavity's smooth surface. Without the tooling assumption, the cost of making a mould would need evaluation before claiming that a 500-part batch is economical.",
    "notation": false
  },
  "y11-design-technology-materials-processes-and-manufacture/exam-5-AQA-core": {
    "question": "Explain how quality assurance would be applied in the manufacture of a plastic mug with a capacity of 350 ml. The mug is produced by injection-moulding plastic and is decorated with a logo within a circular print area of radius 15 mm. The wall thickness is specified as 2.0 mm with a tolerance of ±0.2 mm. Production runs in batches of 1,000 mugs. In your answer, explain the QA activities at the design stage, during production (in-process checks), and at final inspection; describe how any non-conforming mugs would be handled; and explain how batch traceability and continual improvement would be achieved.",
    "marks": 6,
    "markScheme": [
      "QA is a planned, systematic approach that aims to prevent defects by designing quality into products and processes, not just checking at the end.",
      "Design stage: set clear specifications (capacity 350 ml, wall thickness 2.0 ±0.2 mm, print area radius 15 mm) and produce standard operating procedures and acceptance criteria for manufacturing and decoration.",
      "In-process checks: carry out regular checks during production (for example measuring wall thickness and capacity on sample mugs from the batch, checking print alignment and decoration quality) to detect issues early.",
      "Final inspection: test a sample of the batch for capacity, wall thickness within tolerance, print quality, and overall finish; only mugs meeting criteria are approved for packaging.",
      "Non-conforming mugs: quarantine or segregate non-conforming items, log the issue, decide on rework or scrapping, implement corrective actions, and ensure traceability to the batch.",
      "Traceability and continual improvement: assign batch numbers to each run, keep records of materials, processes and test results, analyse data to identify root causes, and update procedures or supplier requirements to reduce future defects."
    ],
    "answer": "Quality assurance in manufacture is a planned, systematic approach to ensure the mug meets its design specifications from start to finish. At design, the team establishes the exact requirements the product must meet: a 350 ml capacity, a wall thickness of 2.0 mm with a tolerance of ±0.2 mm, and a circular logo print area with a radius of 15 mm. They produce clear operating procedures for the manufacturing and decoration processes and set acceptance criteria for each stage so everyone knows what is acceptable. During production, QA uses in-process checks to catch problems early. For the injection-moulding stage, operators measure a sample of mugs from the batch to verify wall thickness is within 1.8–2.2 mm and that the mugs will hold about 350 ml. The decoration stage is checked for correct logo placement and print quality within the 15 mm radius area. If any mug fails, it is flagged and the batch is reviewed to determine whether process adjustments are needed before the next items are made. Final inspection assesses a fresh sample from the batch for capacity, wall thickness, print quality, and overall finish, and may include a simple leak or usability check. Only mugs that pass all criteria are approved for packaging and shipment. Non-conforming mugs are isolated from good batches and kept in quarantine. A non-conformance report is created, the root cause is identified, and a decision made whether to rework, repair, or scrap the items. The batch is marked as affected, and corrective actions are documented to stop recurrence. All actions are recorded for traceability back to the batch. Traceability is established by assigning a batch number to each production run and keeping records of material lots, process parameters, inspection results, and test outcomes. This enables any future investigation or recall to pinpoint where the issue originated. Continual improvement is achieved by analysing the collected data across batches, reviewing success and failure rates, and updating SOPs, inspection plans, and supplier specifications accordingly. Regular reviews of QA procedures ensure lessons learned are implemented, helping to reduce defects in future mugs.",
    "notation": false
  },
  "y11-design-technology-materials-processes-and-manufacture/exam-7-Edexcel-core": {
    "question": "A small rectangular aluminium storage tin is to be manufactured from aluminium sheet 0.8 mm thick, using separate body and lid blanks. The body outer dimensions are 250 mm long, 140 mm wide and 60 mm high. The lid is hinged along the long edge and overlaps the body by 5 mm to create a light seal. The tin should be lightweight, inexpensive to manufacture in batches and resistant to corrosion. Select a suitable manufacturing process for each of the four tasks and give a brief justification for each choice: (a) forming the body from the sheet; (b) forming the lid from another sheet; (c) joining the lid to the body to form the hinge; (d) finishing the surface to protect against corrosion.",
    "marks": 4,
    "markScheme": [
      "Form the body by bending the sheet (press brake) to create the tray shape; justification: aluminium 0.8 mm is suitable for bending, cost-effective for batch production.",
      "Form the lid by cutting a second sheet and bending to create a lid with a 5 mm overlap; justification: ensures accurate size for overlap and a light seal.",
      "Join with rivets along a hinge strip fixed to the long edge to create the hinge; justification: simple, reliable for aluminium, suitable for batch assembly.",
      "Finish with powder coating to protect against corrosion; justification: durable finish, suitable for batch production and available in colours."
    ],
    "answer": "(a) Cut/notch a body blank and bend its sides with a press brake; use folded tabs and suitable joining at the corners to make a tray. Thin aluminium is ductile and suitable for batch forming. (b) Cut and fold a separate lid blank, allowing clearances and the specified 5 mm overlap. (c) Rivet a suitable hinge to both lid and body; this provides a pivot and suits sheet-metal assembly. (d) Prepare and powder-coat the surface for a durable protective finish. An overlap alone does not establish a liquid-tight seal; check the required fit and seal by testing.",
    "notation": false
  },
  "y11-design-technology-materials-processes-and-manufacture/practice-4-AQA-core": {
    "question": "A small metal wall-mounted mug holder is to be produced in a batch of 250. It is made from mild steel sheet 2.5 mm thick. The finished item will be fixed to a brick wall with two screws and has two circular holes in the flat pattern for the screws. The design includes a curved lip to hold a mug. The item must withstand outdoor weather and cost no more than £4.00 per unit. Which two manufacturing processes would be most suitable to make this item from sheet metal, and why is each process appropriate?",
    "hint": "Think about a process that cuts the sheet and makes holes, then a second process that shapes the cut piece into the final form.",
    "working": [
      "Step 1: Laser cutting can cut 2.5 mm mild steel and produce the flat pattern with the two screw holes for a batch of 250.",
      "Step 2: Bending (using a press brake) can form the flat cut blank into the bracket shape with a curved lip from the 2.5 mm sheet.",
      "Step 3: A weather-resistant finish such as galvanising or powder coating would be applied after forming to meet outdoor usage."
    ],
    "answer": "Laser cutting can produce the sheet outline and screw holes accurately from 2.5 mm mild steel without separate hole-drilling operations. Forming with a press brake and suitable tooling can shape the lip; the tooling and bend radius must match the design. A suitable protective finish is also needed for outdoor use. The £4 cost target requires quotations and cannot be guaranteed from the process names alone.",
    "notation": false
  },
  "y11-design-technology-mechanisms-electronics-and-control/exam-0-Edexcel-core": {
    "question": "Assume an ideal, weightless lever with no friction. A lever rests on a fixed fulcrum. The effort is applied downward at a distance of 45 cm from the fulcrum. The load is placed 15 cm from the fulcrum on the opposite side. A 60 N load is to be lifted. Calculate: (a) the mechanical advantage of the lever, and (b) the effort force required to balance the 60 N load. Show your working. Give your answers with units.",
    "marks": 4,
    "markScheme": [
      "Uses the arm ratio 45/15.",
      "Calculates ideal mechanical advantage 3, dimensionless.",
      "Uses effort = load/mechanical advantage = 60/3.",
      "Obtains effort 20 N to balance; a slightly greater effort initiates lifting in the ideal model."
    ],
    "answer": "Ideal mechanical advantage = 45/15 = 3. Effort to balance the load = 60/3 = 20 N. A slightly greater effort would start lifting in this idealised model.",
    "notation": false
  },
  "y11-design-technology-mechanisms-electronics-and-control/exam-2-Edexcel-core": {
    "question": "Explain how a programmable control system could be used to operate a small greenhouse fan. The system uses a temperature sensor that reports the current temperature in degrees Celsius (°C) and a fan as the output. The program should aim to cool the greenhouse; reaching a particular temperature also depends on ambient conditions and fan capacity. The fan should turn ON when the temperature reaches 25°C or higher and turn OFF when the temperature falls below 25°C, but only after the temperature has remained below 25°C for 30 continuous seconds to prevent rapid cycling. Describe how the input, processing and output stages would work, and explain how the threshold and the delay would be implemented in the program.",
    "marks": 5,
    "markScheme": [
      "Identifies temperature sensor input and fan output through a suitable driver.",
      "Turns the fan on immediately at T ≥ 25 °C.",
      "Keeps the fan running while timing a continuous below-threshold interval of 30 seconds.",
      "Resets the timer if T returns to 25 °C or above and continues monitoring without blocking.",
      "Explains that programmable threshold and delay are adjustable; fan capacity limits cooling."
    ],
    "answer": "Read the temperature repeatedly. If T ≥ 25 °C, turn the fan ON immediately and clear any below-threshold timer. If T < 25 °C while the fan is ON, start a timer on the first below-threshold reading; keep the fan ON until 30 continuous seconds below 25 °C have elapsed, then turn it OFF. If T rises to 25 °C during the interval, clear the timer and keep the fan ON. When the fan is already OFF and T < 25 °C, leave it OFF. Use elapsed time rather than a blocking pause so the sensor is still checked. A suitable driver switches the fan. The threshold and delay can be adjusted in software; this control alone cannot guarantee a temperature below 25 °C.",
    "notation": false
  },
  "y11-design-technology-mechanisms-electronics-and-control/exam-4-AQA-core": {
    "question": "Design a simple 5 V circuit in which a pushbutton controls a red LED through an NPN transistor used as a low-side switch. The transistor emitter connects to 0 V; the LED and its series resistor connect between +5 V and the collector. The LED forward voltage is 2.0 V and the transistor drop when on is 0.2 V. For a target current of 15 mA, calculate the ideal LED series resistance and check the current using a 180 Ω resistor. Explain why the base needs a suitable current-limiting resistor and a pull-down resistor so it does not float when the button is released. No transistor-gain calculation is required.",
    "marks": 6,
    "markScheme": [
      "Finds voltage across LED resistor: 5 − 2.0 − 0.2 = 2.8 V.",
      "Converts 15 mA to 0.015 A.",
      "Calculates R = 2.8/0.015 ≈ 187 Ω.",
      "Checks 180 Ω gives 2.8/180 ≈ 15.6 mA and requires component ratings to permit this.",
      "Explains that the base resistor limits base current and protects the transistor/control path.",
      "Explains that a base-to-emitter pull-down provides a defined off state when the button opens."
    ],
    "answer": "The LED resistor has 2.8 V across it, so R = 2.8/0.015 ≈ 187 Ω. A 180 Ω resistor gives about 15.6 mA under the stated voltage assumptions; choose components whose ratings allow that current, accounting for tolerances. The pushbutton drives the base through a suitable resistor to limit base current. A pull-down from base to emitter holds the transistor off when the button is released. Removing the base resistor can damage the base/control path; the separate LED resistor still limits collector-path current, so it is incorrect to claim that base-resistor removal alone makes LED current unlimited.",
    "notation": false
  },
  "y11-design-technology-quantitative-design-skills/exam-1-AQA-core": {
    "question": "In a hobby project, two components, A and B, are cut in lengths that must be in the ratio A:B = 3:2. The total length of the two components when joined is 50.0 cm. Each component has an independent manufacturing tolerance of ±0.5 cm on its length. The housing cavity has an independently manufactured internal length of 50.0 cm ± 1.0 cm. Ignore joints and assume the component lengths add. a) Calculate the nominal lengths of A and B. b) State the minimum and maximum lengths A could be and the minimum and maximum lengths B could be, given the tolerances. c) Determine the range of possible total lengths of the assembly considering the tolerances. d) Will every possible assembly fit inside every possible housing? Justify your answer.",
    "marks": 6,
    "markScheme": [
      "Divides 50 cm in ratio 3:2 to obtain nominal lengths 30 cm and 20 cm.",
      "Finds A range 29.5–30.5 cm.",
      "Finds B range 19.5–20.5 cm.",
      "Adds worst-case limits to obtain assembly range 49–51 cm.",
      "Finds housing cavity range 49–51 cm.",
      "Concludes fit is not guaranteed: a 51 cm assembly will not fit in a 49 cm cavity."
    ],
    "answer": "A is nominally 30 cm and B 20 cm. A can be 29.5–30.5 cm; B can be 19.5–20.5 cm. The assembly can therefore be 49–51 cm long. The independently made cavity is also 49–51 cm, so matching ranges do not guarantee fit: the largest assembly exceeds the smallest cavity by 2 cm. Revise nominal clearances or tolerances to guarantee assembly.",
    "notation": false
  },
  "y11-design-technology-testing-and-evaluation/exam-3-AQA-core": {
    "question": "Question 4 – Test a prototype against the specification. A Year 11 Design Technology student has produced a foldable tablet stand to support tablets up to 260 mm wide and 15 mm thick. The stand specification requires: width capacity 260 mm; thickness capacity 15 mm; base width 180 mm; stand height 120 mm; adjustable incline 15° to 60°; total mass not exceeding 450 g; non-slip silicone feet; material ABS plastic; edges rounded with a minimum radius of 2 mm; no sharp edges or pinch points. The prototype is made from ABS plastic and has the following measured properties: can accommodate tablets up to 230 mm wide; can accommodate tablets up to 12 mm thick; base width 170 mm; stand height 110 mm; incline range 10° to 58°; mass 420 g; non-slip silicone feet fitted; edges rounded with a 4 mm radius. Evaluate whether the prototype meets the specification. State which aspects meet and which do not, and explain how any gaps could affect usability.",
    "marks": 6,
    "markScheme": [
      "1 mark: identifies ABS, mass 420 g and 4 mm edge radius as meeting the stated material/mass/radius requirements.",
      "1 mark: identifies width capacity 230 versus 260 mm and explains larger tablets will not fit.",
      "1 mark: identifies thickness capacity 12 versus 15 mm and explains thicker tablets will not fit.",
      "1 mark: identifies base width 170 versus 180 mm and height 110 versus 120 mm as dimensional failures.",
      "1 mark: explains the 10–58° range does not reach the required 60°, although it includes 15°; lower settings are additional.",
      "1 mark: distinguishes silicone feet being fitted from verified slip resistance and notes sharp edges/pinch points need inspection and testing."
    ],
    "answer": "Meets: the material is ABS, 420 g is within the 450 g limit, and the 4 mm edge radius exceeds the 2 mm minimum. Silicone feet are fitted, although actual resistance to slipping still needs a test.\n\nDoes not meet: width capacity is 230 rather than 260 mm, and thickness capacity is 12 rather than 15 mm, excluding some intended tablets. Base width is 170 rather than 180 mm and height is 110 rather than 120 mm; stability and viewing position need checking. The incline reaches only 58°, so the required 60° setting is unavailable. It can reach 15° despite also allowing lower angles.\n\nNo evidence establishes the absence of sharp edges or pinch points. Inspect and test these separately; a sufficient edge radius alone does not prove overall safety.",
    "notation": false
  },
  "y11-design-technology-testing-and-evaluation/exam-3-Edexcel-core": {
    "question": "You are evaluating a prototype of a compact desk phone stand designed to hold a smartphone in landscape orientation. The design brief specifies: Length: 15.0 cm Width: 3.0 cm Folded thickness: maximum 1.5 cm Weight: 80 g or less The stand must allow phones up to 8.0 cm wide to be slotted in securely. During testing, you measured: Length: 15.0 cm Width: 3.0 cm Folded thickness: 1.7 cm Weight: 76 g For a phone up to 8.0 cm wide, the stand holds devices up to 7.9 cm wide The edge where fingers touch feels sharp Using these results, identify which specification requirements are met or not, and explain briefly what you would change to bring the stand into full compliance.",
    "marks": 6,
    "markScheme": [
      "The length specification is met (length 15.0 cm).",
      "The width specification is met (width 3.0 cm).",
      "The folded thickness specification is not met (folded thickness 1.7 cm exceeds the 1.5 cm maximum).",
      "The weight specification is met (weight 76 g is within the 80 g limit).",
      "Phone fit fails: 7.9 cm is less than the required 8.0 cm.",
      "Proposes reducing folded thickness, widening the phone opening, rounding sharp edges and retesting."
    ],
    "answer": "Length (15.0 cm), width (3.0 cm) and mass (76 g) meet the stated limits. Folded thickness fails: 1.7 cm exceeds 1.5 cm. Phone fit also fails: the opening holds only 7.9 cm rather than 8.0 cm. Reduce hinge/body thickness and widen the opening while checking strength, security and external dimensions. Round the sharp contact edge for safe handling. Retest with an 8.0 cm phone or gauge, measure folded thickness and mass, and assess stability after the changes.",
    "notation": false
  },
  "y11-design-technology-testing-and-evaluation/exam-4-AQA-core": {
    "question": "You have designed a plastic lunch box with a hinged lid made from polypropylene. The outer dimensions are 18.0 cm long, 12.0 cm wide and 4.0 cm high. In testing, you collected the following data: - Drop test from a height of 1.0 m onto a hard floor: 5 boxes were tested; 2 cracked at the hinge area, 3 remained intact. - Load test: with the lid closed, a 2.0 kg mass was placed on the lid for 60 seconds; the indentation measured 0.8 mm near the hinge. - Hinge durability test: the lid was opened and closed 25 times; the hinge became stiffer but did not fail. Using this test data, identify two or three design changes you would apply to improve performance and explain why these changes would address the weaknesses shown by the data.",
    "marks": 5,
    "markScheme": [
      "Use the 2/5 drop-test failures to identify a hinge-area impact weakness.",
      "Propose a justified change around the hinge attachment or stress concentration.",
      "Use the measured lid indentation to justify a lid-stiffness change.",
      "Use the observed stiffening to propose investigating hinge geometry or an alternative hinge.",
      "Explain retesting and recognise the small sample and short durability trial."
    ],
    "answer": "First, revise the transition between the hinge and body to reduce stress concentration, since two of five samples cracked there in the 1 m drop test. Test smoother transitions or local support without simply making the flexible hinge thicker, which could make opening harder. Second, trial ribs on the lid to reduce its 0.8 mm indentation under the 2 kg load, then check that they do not obstruct closure or cleaning. Third, investigate hinge clearance and flexure geometry, or trial a pin hinge, because stiffness increased after only 25 cycles. Repeat comparable drop, load and longer-cycle tests on more samples. These are proposed improvements, not guaranteed fixes; also check opening force and any pinch points.",
    "notation": false
  },
  "y11-design-technology-testing-and-evaluation/practice-0-AQA-core": {
    "question": "Design measurable tests for a snap‑fit lunchbox lid to evaluate two performance aspects: (a) leakage resistance when the lunchbox is inverted and moved, and (b) durability of the lid under repeated opening and closing. The lunchbox has external dimensions: length 20.0 cm, width 12.0 cm, height 6.0 cm; the lid thickness is 2.0 mm and the snap‑fit projection is 5.0 mm. Plan a measurable test that uses only simple equipment. Your plan should specify: what you will measure (with units), how you will measure it (equipment and setup), the procedure (step‑by‑step, including cycle counts and test durations), how many samples you will test and how you will compare results, and the acceptance criteria for passing. Use values that are realistic for a Year 11 project.",
    "hint": "Focus on repeatable measurements and clear pass/fail criteria.",
    "working": [
      "Define proposed classroom test criteria and distinguish them from an official product standard.",
      "Measure liquid that escapes into a separate tray, not water remaining inside the box.",
      "Compare opening force before and after repeated cycles and repeat the leak test."
    ],
    "answer": "Test three identical prototypes with room-temperature water. Agree these proposed classroom acceptance targets before testing; they are not a product-safety standard.\n\nLeak test: put 200 ml in each box and close it consistently. Invert fully over a dry tray able to hold at least 250 ml for two minutes. While inverted, move the box gently through a marked 10 cm travel ten times. Return it upright without spilling. Measure only water collected in the tray, using a suitable graduated measure; record to its actual resolution. Proposed pass: no more than 2 ml from any sample.\n\nDurability: measure opening force at a defined lid tab and pull direction using a force gauge, then open and close each lid 200 times, counting cycles. Re-measure the opening force and repeat the leak test. Proposed pass: no cracks or failed clips, opening force still between 2 and 5 N, and the same leakage limit. Verify those force targets with intended users.\n\nRecord each sample separately, including initial/final force and leakage, rather than hiding a failure in the mean. Keep fill level, closure method, movement and temperature consistent. Extend cycle testing later if the intended service life requires it.",
    "notation": false
  },
  "y11-design-technology-testing-and-evaluation/practice-0-Edexcel-core": {
    "question": "Outline a measurable test plan to evaluate two properties of a newly designed plastic bottle with a screw-cap lid: (a) ease of opening for users with normal hand strength, and (b) leak resistance during a vertical shake test. For each property, specify: (i) the measurement you would take (including units), (ii) the method of testing, (iii) the number of samples you would test, and (iv) the pass/fail criteria.",
    "hint": "Focus on simple, repeatable measurements and clear pass/fail criteria.",
    "working": [
      "Use turning torque for a screw cap rather than a vertical pull.",
      "Standardise fill level, closure torque, temperature and shake movement.",
      "Set measurable proposed criteria and record failures for individual samples."
    ],
    "answer": "Opening: use a calibrated cap torque tester or suitable torque fixture, recording the torque needed to start unscrewing in N m. Test five identical bottles, each closed to the same specified torque and held at the same temperature. A provisional classroom target might be no more than 1.0 N m opening torque, but this must be checked with intended users; it is not a universal accessibility threshold.\n\nLeakage: fill five bottles to 90% capacity with room-temperature water and close each consistently. Hold each over a dry tray and shake vertically through a marked 10 cm travel, one full up-and-down cycle per second for 20 seconds. Collect and measure escaped water with equipment of stated resolution, also checking for visible wetting. Proposed pass: no visible leakage from any sample, with any measurable loss recorded. Repeat trials and inspect caps and seals after testing.",
    "notation": false
  },
  "y11-design-technology-testing-and-evaluation/practice-8-Edexcel-core": {
    "question": "Evaluate the plastic lunch pot with a screw-on lid against the specification below, using the test data provided: Specification: (a) capacity at least 700 ml; (b) external dimensions no more than 20 cm long, 10 cm wide and 8 cm high; (c) empty mass no more than 180 g; (d) safe for hot liquids up to 80 °C; (e) leak-proof when filled to capacity. Test data: capacity 650 ml; dimensions 18 cm × 9 cm × 7 cm; empty mass 150 g; rated for hot liquids up to 75 °C; leak test: no leaks when filled to 600 ml and shaken for 30 minutes. Evaluate which criteria are met or not and explain how the results affect suitability for a school lunch use.",
    "hint": "Compare each criterion with the test data and note where the product meets or fails the specification.",
    "working": [
      "Step 1: Capacity criterion – required 700 ml, test result 650 ml → not met.",
      "Step 2: Dimensions criterion – 18 cm ≤ 20 cm, 9 cm ≤ 10 cm, 7 cm ≤ 8 cm → all three dimensions meet the specification → criterion met.",
      "Step 3: Empty mass criterion – ≤180 g, test result 150 g → criterion met.",
      "Step 4: Temperature safety criterion – required 80 °C, test rating 75 °C → not met.",
      "The leak test used 600 ml, below the actual 650 ml capacity, so the full-capacity leak criterion is not demonstrated.",
      "Two criteria are met (b and c); two fail (a and d); one is not demonstrated (e)."
    ],
    "answer": "The pot meets the dimension and empty-mass limits. It fails the 700 ml capacity requirement and the 80 °C rating. Full-capacity leak resistance is not demonstrated by the 600 ml test. It therefore does not meet the given product specification. Increase usable capacity and temperature resistance, then repeat the leak test at full capacity and check all other criteria after modification.",
    "notation": false
  },
  "y11-english-century/exam-3-Edexcel-core": {
    "question": "This is a short extract-to-whole-novel skills exercise using Great Expectations, not a full official paper. During Joe’s visit to Pip in London in Chapter 27, Joe says:\n\n“You and me is not two figures to be together in London”\n\nStarting with this quotation, explain how Dickens explores social status and personal worth. Analyse the quotation and connect it to Pip’s treatment of Joe and Joe’s later care for Pip during illness. Source: Charles Dickens, Great Expectations, Chapter 27 (Project Gutenberg).",
    "marks": 6,
    "markScheme": [
      "Present a relevant argument about status and worth.",
      "Use the supplied quotation accurately.",
      "Analyse the separation suggested by two figures and not together.",
      "Explain Pip’s embarrassment about Joe in London.",
      "Connect Joe’s later care for Pip to the argument about personal worth.",
      "Explain Dickens’s criticism through these connections rather than simply retelling events."
    ],
    "answer": "Dickens separates social position from moral worth. Joe’s description of himself and Pip as “two figures” makes their meeting seem like an awkward arrangement, while “not … together in London” identifies a social distance that Pip’s changed circumstances have created. Joe recognises the discomfort without angrily accusing Pip. His non-standard grammar also contrasts with the polished identity Pip is trying to acquire, but the novel does not equate polished speech with kindness.\n\nPip’s embarrassment during Joe’s visit reveals how ambition has made him ashamed of someone who has cared for him. Later, Joe nurses Pip during illness and helps with his debts. Those actions expose the inadequacy of judging people by appearance or wealth: Joe offers generosity that Pip’s new social standing cannot guarantee. Through Pip’s eventual recognition of his own ingratitude, Dickens presents personal worth as a matter of conduct and affection rather than gentlemanly display.",
    "notation": false
  },
  "y11-english-century/practice-1-Edexcel-core": {
    "question": "Question 2 — In the extract below, analyse how the writer uses language and structure to convey mood and Mr Hargreave's state of mind. Read the passage carefully: \"Fog lay in the street like a damp blanket, and from the alley came the clatter of a chair being dragged along the cobbles. Mr Hargreave paused at the shutter, listening as if the city itself spoke to him in the language of pipes and gaslight. The lamp flickered, and its yellow eye burned for a moment with courage, then steadied, as if weary of bearing witness to sorrow. He lifted his hat, and the cold gust found the line of his spine, making him suddenly aware of every fault he had ever kept hidden. Yet pride, stubborn as a dog, kept him moving; the gate groaned in its hinge and promised nothing but the long night ahead.\"",
    "hint": "Look at how the fog and lamp imagery set the mood, and how the sentence lengths and the shift from external description to inner thought affect pace and tension.",
    "working": [
      "Step 1: The imagery of fog as a \"damp blanket\" and the lamp described as a \"yellow eye\" create a claustrophobic, watchful mood and link the urban environment to Mr Hargreave’s feelings.",
      "Step 2: Personification and metaphor (the city \"speaking\" to him; the lamp \"eye\") reveal how he experiences the city as a character that judges or probes him, hinting at his pride and vulnerability.",
      "Step 3: The sentence-length pattern—long, flowing clauses followed by tighter phrases (e.g., \"The lamp flickered, and its yellow eye burned for a moment with courage, then steadied...\")—builds a measured pace that alternates between description and momentary reflection, increasing suspense.",
      "Step 4: The structural move from external description (fog, gate, street) to internal reflection (awareness of his faults) shows mood intensifying from observed atmosphere to inner conflict, emphasising his struggle between pride and fear."
    ],
    "answer": "The extract uses vivid urban imagery to establish a moody, oppressive atmosphere, with fog likened to a damp blanket and the lamp described as a yellow eye that “burned for a moment with courage” before tiring. This imagery frames Mr Hargreave as someone under surveillance by an impersonal city, suggesting vulnerability beneath outward pride. The personification of the city and lamp makes the environment feel active in judging him, while the gate “groaned” to signal a weighty, perhaps ominous, future. The sentence structure alternates between extended, descriptive statements and tighter phrases, creating a measured pace that mirrors Hargreave’s cautious hesitation. The shift from external scene to his inner awareness—“making him suddenly aware of every fault he had ever kept hidden”—renders mood from atmospheric to introspective, underscoring the conflict between his pride and fear. Overall, the language and structure work together to present a 19th-century urban setting that reflects the protagonist’s moral unease and foreshadows a turning point driven by internal tension rather than action alone.",
    "notation": false
  },
  "y11-english-century/practice-9-Edexcel-core": {
    "question": "In this complete original miniature narrative inspired by nineteenth-century fiction, select two quotations that would serve as whole-text evidence to support the statement: \"The narrator's life is shaped by the authority and expectations of others.\" Complete teaching text: On the third stair, the walls pressed in with the weight of old portraits, and I learned that quietness was the first law of the house. \"Your place is here, where duty sits at the head of your table,\" my aunt would insist, \"and there is nothing more to be desired.\" The clock counted every moment of my obedience, and the sound of its tick went on long after my heart had learned to be still. \"Silence is the best mother to your better self,\" her voice would say when I began to question, while the door to the world outside remained shut, not because it would keep me safe, but because to open it would be to forget myself. Yet sometimes a memory or a night breeze would steal through the latch and remind me that the life I might have lived was not the life I was allowed to tell.",
    "hint": "Focus on moments where control, duty, or silence restrict the narrator. Choose two quotes that best show how others shape the narrator’s life, not the narrator’s own desires.",
    "working": [
      "Step 1: Read the extract and identify lines that show restriction or authority over the narrator.",
      "Step 2: From those lines, pick two quotations that clearly illustrate life shaped by others’ expectations.",
      "Step 3: Ensure the chosen quotes are directly from the extract and would support a broader analysis of the theme.",
      "Step 4: Phrase briefly how each quotation supports the theme in your answer."
    ],
    "answer": "“Your place is here, where duty sits at the head of your table” presents the aunt’s expectations as an authority governing the narrator’s life. “The clock counted every moment of my obedience” suggests that this control shapes even the narrator’s sense of passing time. Both quotations are taken directly from the supplied teaching text.",
    "notation": false
  },
  "y11-english-creative/exam-1-Edexcel-core": {
    "question": "Write an original narrative of about 900–1,000 words that shows your command of controlling the whole-text structure. Your story should be told non-linearly: begin in the present with a decisive moment, weave in at least two embedded flashbacks that illuminate the backstory, and finish with a reveal or reframing that changes how the opening is understood. Use careful choices about paragraph length and sentence rhythm to influence pace and mood. Set the story in a coastal town in England and centre on a teenager returning home after a difficult absence. Include at least one object that links past and present (for example a photograph, a key, or a letter). No headings, bullet points, or lists. Aim for about 900–1,000 words.",
    "marks": 6,
    "markScheme": [
      "Demonstrates clear control of whole-text structure, with a present moment and at least two integrated flashbacks that illuminate the narrative.",
      "Uses signposted shifts (e.g., memories triggered by objects) to integrate flashbacks smoothly.",
      "Demonstrates deliberate control of pace and mood through varied sentence lengths and paragraphing.",
      "Creates a vivid, authentic coastal setting with sensory detail and atmosphere.",
      "Uses an object (the box, map, key) as a motif linking past and present.",
      "Ends with a twist or reframing of the opening that provides thematic coherence."
    ],
    "answer": "I put the key in the lock, then took it out again. Through the workshop window I could see the pale rectangle where our boat had stood. Everything else was familiar: the jars of screws, the crooked calendar, the yellow coat hanging from a nail. Only the boat was missing. After six months away, I had come home to find that Dad had finally done it.\n\nBehind me, the storm had left the harbour scattered with ropes and broken boards. A gull picked at something beside the slipway. It was late afternoon in our small Devon town, and the shops were closing early while their owners swept seawater from the doorways. I was sixteen, halfway through Year 11, carrying a school bag packed for a weekend that already felt too long.\n\nThe key had arrived at Aunt Rachel's house on Tuesday. There had been no letter, only my name on the envelope in Dad's square handwriting. Rachel had turned it over between her fingers. “You could ask him what he wants.” I said I knew. He wanted me to collect the last of my things so he could sell the workshop as well.\n\nNow I pressed my forehead against the cold window. The boat had belonged to Mum. She had called it a floating argument because she and Dad could never agree which colour it should be. In the end, she painted the hull blue and the seats green. Dad complained for years, carefully touching up both colours whenever the paint began to peel.\n\nWhen I was nine, Mum let me paint the name beneath the bow. I chose enormous letters and ran out of room before the final one. Dad suggested sanding it off. Mum studied my crooked work, then passed me a smaller brush. “There is usually another way,” she said. Together we tucked the last letter around the curve. Afterwards, she photographed me beside it, my hands held away from my clothes like a surgeon's.\n\nI had forgotten that photograph until now. I remembered the paint instead: a blue streak across my wrist, a green fingerprint on Mum's cheek. For a moment I could almost hear her laughing at the state of us. Then a loose sheet of metal clattered against the neighbouring shed, and the empty workshop returned.\n\nSix months earlier, Dad had stood in exactly this doorway with a man I did not know. The man wore clean shoes and carried a tape measure. He walked around the boat, making notes, while Dad answered questions about the timber. I watched from the path. Mum had been dead for eleven months. Apparently that was long enough.\n\nThat evening I accused him of selling her boat. He said it needed work we could not do ourselves. I said he could sell his own things first. The argument grew quickly, feeding on everything we had avoided saying. When he asked me to listen, I heard an order. When I packed my bag, he thought I meant to frighten him. Rachel collected me after dark. Neither of us came to the gate.\n\nAt her house, silence became a habit. Dad sent messages about school and the weather. I answered the school questions and ignored the rest. Each ordinary sentence seemed proof that he had forgotten what mattered. I never asked about the man with the tape measure. Asking would have meant admitting that I might not know the whole story.\n\nI turned the key. The door dragged across the floor with its familiar scrape. Inside, the air smelled of sawdust and damp wool. My old mug stood beside the kettle. There was a fresh packet of the biscuits I used to eat while pretending to help. On the bench lay a folded sheet of paper, weighted down with a tin of blue paint.\n\nIt was an invoice from a boat repairer. I read the date, then the list: damaged ribs, replacement planks, repairs to the stern. At the bottom, someone had written, “Retain existing colours and name. Owner requests original lettering preserved.” The man in the clean shoes had not been buying our boat. He had been measuring what it would take to save it.\n\nFootsteps stopped outside. Dad stood in the doorway with rain on his glasses. For several seconds neither of us spoke. I held out the invoice, although he must have known what I had found. “It comes back on Monday,” he said. His voice sounded careful, as if the words were newly made and might break if he used them roughly.\n\nHe pointed to the empty floor. “They found rot underneath. More than I thought.” I imagined him here through the winter, moving our things out of the repairer's way, choosing what could be saved. The neat answers in his messages had concealed a life as unfinished as mine.\n\nI looked towards the yellow coat. Beneath it, on the nail, hung a second key. Mine had not been a demand to remove my belongings. It had been an invitation he had not known how to put into words. I wanted to explain everything at once, but the apology caught behind my teeth. Instead I asked whether the kettle still worked.\n\nDad took off his glasses and nodded. I set down my school bag beside the bench. Outside, somebody began hammering a broken shutter back into place. The sound travelled across the harbour, steady and practical. I put my key on the table between us. This time, I left it there.",
    "notation": false
  },
  "y11-english-creative/exam-2-Edexcel-core": {
    "question": "Proofread accurately Read the following original paragraph. The paragraph contains spelling and punctuation errors. Rewrite the paragraph with the corrections so that it reads clearly and keeps the voice of the narrator. Original paragraph: On the night of the storm Lara walked along the shore, listening to the waves crash and the rain drum on the sand. She had promised herself she would write down every detail, colur and sound so she wouldn't forget this eveneing. The air was cold, but there was a warm glow from the pub lights across the cove Inside, a cat purred and the old clock ticked loudly. When she reached the pier she saw a small boat bobbing gently, its paint peeling and its rope frayed. She knew that if she looked away for a moment the moment would pass; therefore she kept her eyes fixed on the water, searching for a line to take home with her. She thought of home, of parents, and of all the little chances life had given her",
    "marks": 6,
    "markScheme": [
      "Corrects colur to colour.",
      "Corrects eveneing to evening.",
      "Adds a full stop after cove, separating the next sentence.",
      "Adds a final full stop after her.",
      "Uses commas to clarify introductory or conditional clauses where appropriate.",
      "Preserves meaning and narrative voice in a coherent corrected paragraph."
    ],
    "answer": "On the night of the storm, Lara walked along the shore, listening to the waves crash and the rain drum on the sand. She had promised herself she would write down every detail, colour and sound, so she wouldn't forget this evening. The air was cold, but there was a warm glow from the pub lights across the cove. Inside, a cat purred and the old clock ticked loudly. When she reached the pier, she saw a small boat bobbing gently, its paint peeling and its rope frayed. She knew that if she looked away for a moment, the moment would pass; therefore she kept her eyes fixed on the water, searching for a line to take home with her. She thought of home, of parents, and of all the little chances life had given her.",
    "notation": false
  },
  "y11-english-creative/exam-6-AQA-core": {
    "question": "Question 7 (Plan efficiently) – Creative Writing Mastery: You are planning an original 1,000-word short story in which a Year 11 student discovers a hidden room in the school basement that reveals a past version of the school. Plan efficiently: produce a concise, detailed plan of approximately 220–250 words in scene-by-scene format. For each Scene (Scene 1 to Scene 5), include: setting and time; who is present; what happens and how it moves the plot; the tone and pace you will aim for; and how you will reveal character and theme. Additionally, indicate the narrative voice and perspective you will use and justify why. Include at least one turning point and explain how you will sustain suspense. Do not write the actual story. The plan should enable you to write around 1,000 words in a single draft. Use plain English, suitable for GCSE Level.",
    "marks": 6,
    "markScheme": [
      "Clear statement of the intended audience, purpose and how the plan meets the brief.",
      "Coherent overall structure with a clear arc and at least five scenes moving the plot.",
      "Detailed, scene-by-scene breakdown: setting/time, characters present, events, and how each scene advances the plot.",
      "Identification of a turning point and explanation of how it affects tension and pace.",
      "Justification of narrative voice/perspective and its effect on meaning.",
      "Planning notes on language, mood, pace, and motifs to sustain suspense."
    ],
    "answer": "Voice: first-person present, so readers discover the room alongside a sixteen-year-old narrator. The story explores whether remembering the past should change present choices. Each scene will develop into roughly two hundred words.\n\nScene 1: At school after lessons, the narrator searches the basement for a missing project. A draught moves behind stacked boxes, revealing a door. Use slow description, interrupted by short sounds, to establish curiosity and unease.\n\nScene 2: Inside, old desks surround a chalkboard dated 1964. The narrator is alone but hears chairs scrape. Introduce a pupil’s diary and familiar school rules to connect past and present.\n\nScene 3: As daylight fades, the diary describes a pupil blamed for another person’s mistake. The narrator recognises their own recent silence when a friend was blamed. Slow the pace through remembered dialogue.\n\nScene 4: A new diary entry appears, describing tomorrow’s assembly. This is the turning point: the narrator must decide whether to protect their reputation or tell the truth. Withhold the entry’s final sentence and shorten paragraphs to sustain suspense.\n\nScene 5: Back in the corridor, the narrator messages the teacher to request a conversation. A fresh chalk mark remains on their sleeve, leaving the room’s reality uncertain. Echo the opening draught, now felt as encouragement rather than threat, and finish with cautious hope. Repeat the chalk motif at the discovery, turning point and ending to connect the scenes.",
    "notation": false
  },
  "y11-english-creative/exam-8-Edexcel-core": {
    "question": "Read the passage below. It contains a number of spelling, punctuation and grammar errors. Write a corrected version of the passage in one continuous paragraph, keeping the original meaning, and use UK English spellings. Do not add new ideas. The passage is about a day at the riverside park with a friend. Last saturday I went to the old riverside park with my best friend, Maya. The day was warm, and the air smelt of blossom and cut grass. We walked along the path beside the water, watching ducks and a swan preening its feathers. Maya told me a ghost story about the weeping willow by the bridge, but i laughed and told her it was nonsense. As we sat on a bench, a child droped a blue balloon and it drifted away toward the trees. A jogger passed us, and I waved, feeling recomended to take more photos. The park seems to hold quiet magic when the sun shawns through the clouds, like gold on the river. When we left, I promised I would come again soon, because I want to remember this perfect moment.",
    "marks": 6,
    "markScheme": [
      "Spelling errors corrected throughout the passage.",
      "Capitalisation errors corrected (e.g., I, Saturday).",
      "Punctuation errors corrected (commas, full stops, etc.).",
      "Grammar errors corrected (subject-verb agreement, tense consistency).",
      "Sentence structure improved to remove run-ons or fragments.",
      "The final rewritten passage is coherent and uses correct UK English spelling and grammar."
    ],
    "answer": "Last Saturday I went to the old riverside park with my best friend, Maya. The day was warm, and the air smelled of blossom and cut grass. We walked along the path beside the water, watching ducks and a swan preening its feathers. Maya told me a ghost story about the weeping willow by the bridge, but I laughed and told her it was nonsense. As we sat on a bench, a child dropped a blue balloon and it drifted away towards the trees. A jogger passed us, and I waved, feeling encouraged to take more photos. The park seems to hold quiet magic when the sun shines through the clouds, like gold on the river. When we left, I promised I would come again soon, because I want to remember this perfect moment.",
    "notation": false
  },
  "y11-english-creative/practice-1-AQA-core": {
    "question": "Write an 800–1000 word short story that demonstrates control of whole-text structure by using a non-linear sequence to shape pace and tension. Set the story in a single day in a small coastal town after a severe storm. The narrator must be a Year 11 student, using first-person narration. Your story should include two deliberate structural features that affect how the reader experiences events, such as a frame narrative and a flashback presented in reverse chronology, and should lead to a clear twist or reveal by the end. The prose should be suitable for GCSE English, with an emphasis on craft and structure.",
    "hint": "Consider starting with the present moment to frame the aftermath, then reveal the past backwards to show how each clue connects.",
    "working": [
      "Frame the story around the key and the locked workshop during one afternoon after a storm.",
      "Use a childhood memory to establish the boat’s emotional significance.",
      "Return to a more recent argument to explain the narrator’s mistaken assumption and absence.",
      "Reveal the repair invoice and reinterpret the key as an invitation, resolving the emotional conflict through a small action."
    ],
    "answer": "I put the key in the lock, then took it out again. Through the workshop window I could see the pale rectangle where our boat had stood. Everything else was familiar: the jars of screws, the crooked calendar, the yellow coat hanging from a nail. Only the boat was missing. After six months away, I had come home to find that Dad had finally done it.\n\nBehind me, the storm had left the harbour scattered with ropes and broken boards. A gull picked at something beside the slipway. It was late afternoon in our small Devon town, and the shops were closing early while their owners swept seawater from the doorways. I was sixteen, halfway through Year 11, carrying a school bag packed for a weekend that already felt too long.\n\nThe key had arrived at Aunt Rachel's house on Tuesday. There had been no letter, only my name on the envelope in Dad's square handwriting. Rachel had turned it over between her fingers. “You could ask him what he wants.” I said I knew. He wanted me to collect the last of my things so he could sell the workshop as well.\n\nNow I pressed my forehead against the cold window. The boat had belonged to Mum. She had called it a floating argument because she and Dad could never agree which colour it should be. In the end, she painted the hull blue and the seats green. Dad complained for years, carefully touching up both colours whenever the paint began to peel.\n\nWhen I was nine, Mum let me paint the name beneath the bow. I chose enormous letters and ran out of room before the final one. Dad suggested sanding it off. Mum studied my crooked work, then passed me a smaller brush. “There is usually another way,” she said. Together we tucked the last letter around the curve. Afterwards, she photographed me beside it, my hands held away from my clothes like a surgeon's.\n\nI had forgotten that photograph until now. I remembered the paint instead: a blue streak across my wrist, a green fingerprint on Mum's cheek. For a moment I could almost hear her laughing at the state of us. Then a loose sheet of metal clattered against the neighbouring shed, and the empty workshop returned.\n\nSix months earlier, Dad had stood in exactly this doorway with a man I did not know. The man wore clean shoes and carried a tape measure. He walked around the boat, making notes, while Dad answered questions about the timber. I watched from the path. Mum had been dead for eleven months. Apparently that was long enough.\n\nThat evening I accused him of selling her boat. He said it needed work we could not do ourselves. I said he could sell his own things first. The argument grew quickly, feeding on everything we had avoided saying. When he asked me to listen, I heard an order. When I packed my bag, he thought I meant to frighten him. Rachel collected me after dark. Neither of us came to the gate.\n\nAt her house, silence became a habit. Dad sent messages about school and the weather. I answered the school questions and ignored the rest. Each ordinary sentence seemed proof that he had forgotten what mattered. I never asked about the man with the tape measure. Asking would have meant admitting that I might not know the whole story.\n\nI turned the key. The door dragged across the floor with its familiar scrape. Inside, the air smelled of sawdust and damp wool. My old mug stood beside the kettle. There was a fresh packet of the biscuits I used to eat while pretending to help. On the bench lay a folded sheet of paper, weighted down with a tin of blue paint.\n\nIt was an invoice from a boat repairer. I read the date, then the list: damaged ribs, replacement planks, repairs to the stern. At the bottom, someone had written, “Retain existing colours and name. Owner requests original lettering preserved.” The man in the clean shoes had not been buying our boat. He had been measuring what it would take to save it.\n\nFootsteps stopped outside. Dad stood in the doorway with rain on his glasses. For several seconds neither of us spoke. I held out the invoice, although he must have known what I had found. “It comes back on Monday,” he said. His voice sounded careful, as if the words were newly made and might break if he used them roughly.\n\nHe pointed to the empty floor. “They found rot underneath. More than I thought.” I imagined him here through the winter, moving our things out of the repairer's way, choosing what could be saved. The neat answers in his messages had concealed a life as unfinished as mine.\n\nI looked towards the yellow coat. Beneath it, on the nail, hung a second key. Mine had not been a demand to remove my belongings. It had been an invitation he had not known how to put into words. I wanted to explain everything at once, but the apology caught behind my teeth. Instead I asked whether the kettle still worked.\n\nDad took off his glasses and nodded. I set down my school bag beside the bench. Outside, somebody began hammering a broken shutter back into place. The sound travelled across the harbour, steady and practical. I put my key on the table between us. This time, I left it there.",
    "notation": false
  },
  "y11-english-creative/practice-6-AQA-core": {
    "question": "Plan an original 800–1000 word short story; write the plan, not the finished story. A Year 11 student, Maya, discovers a locked metal box behind a shelf in a seaside school library. It contains five letters from five different decades, written by a woman who had a secret relationship with a former councillor. The letters challenge a local belief about the town’s history. Include an idea, setting, viewpoint, three-act outline, at least three turning points, showing techniques and a word allocation. Keep the plan concise and make clear how the locked box is opened.",
    "hint": "Focus on one central tension that unfolds across the three acts; avoid including too many subplots.",
    "working": [
      "Choose one concrete historical dispute and keep the relationship relevant to it.",
      "Use present-day first-person Maya and letters dated in five named decades.",
      "Plan discovery, testing the apparent revelation and a decision about disclosure.",
      "Allocate 900 words across three acts and identify showing techniques."
    ],
    "answer": "Idea: Maya discovers that a town shelter credited to a councillor may have been planned and funded by the woman whose contribution he concealed. Their secret relationship complicates his public reputation.\n\nSetting and viewpoint: a present-day seaside town; first-person Maya, aged 16. The fictional letters date from 1958, 1966, 1974, 1983 and 1991.\n\nAct 1 — discovery, 200 words: the box falls behind a shelf during supervised library reorganisation. Maya gives it to the librarian, who finds its labelled key in the school archive cabinet. First turning point: an opened letter names a woman absent from the shelter’s commemorative plaque. Show curiosity through Maya rereading the signature and tracing the ink.\n\nAct 2 — investigation, 450 words: Maya reads brief extracts and compares them with the plaque and a surviving committee minute. Second turning point: a letter reveals the secret relationship. Third turning point: the later letter claims the woman accepted anonymity to protect someone else. Maya realises that a discovery does not automatically explain every motive. Use short dialogue with the librarian and the contrast between polished brass and fragile paper.\n\nAct 3 — decision, 250 words: Maya proposes an archive display presenting the evidence and its uncertainties, rather than an accusation. She returns to the plaque and notices its silence differently. End with an action — writing the woman’s name on a provisional display card — rather than a speech explaining the moral.\n\nPacing: 200 + 450 + 250 = 900 words for the future story. Keep letter quotations short, expand the moment when Maya’s first interpretation is challenged, and use a brief final paragraph to echo the opening discovery.",
    "notation": false
  },
  "y11-english-creative/practice-7-AQA-core": {
    "question": "Write a 600–700 word short story for the GCSE English Creative Writing task that demonstrates control of whole-text structure. Tell the story in a non-linear order using three flashbacks that illuminate a central event. Begin with a quiet dawn on a coastal town and end with a twist that reframes the opening; ensure the final paragraph ties back to the opening image. The narrator's motive should be revealed only in the last paragraph. Use varied sentence lengths to control pace and tension.",
    "hint": "Consider how the opening dawn can be echoed at the end to create a strong circular effect.",
    "working": [
      "Step 1: Plan a central event that all three flashbacks illuminate, so the non-linear structure can reveal it from different angles.",
      "Step 2: Write an opening set at dawn by the harbour to establish mood, then introduce a sealed letter or object that anchors the present.",
      "Step 3: Outline three distinct memories that reappear out of order, each shedding light on why the narrator has returned and what they fear or want to confess.",
      "Step 4: Design a final paragraph that reframes the opening image in light of the revealed motive, creating a clear circular closure.",
      "Step 5: Ensure sentence lengths vary to build pace and suspense, and that the final reveal sits in the last paragraph."
    ],
    "answer": "At dawn, the harbour lay beneath a sheet of pale glass. Nothing moved except a narrow fishing boat turning against its rope. I stood beside the closed ticket office with a brown envelope under my arm. Across the road, the bakery windows were dark. A gull landed on the rail and watched me fold the envelope's corner, straighten it, then fold it again.\n\nYesterday afternoon, the woman at the newspaper desk had asked whether I wanted to leave a message. Behind her, framed front pages covered the wall: storms, elections, the opening of the new swimming pool. One photograph showed the harbour steps crowded with people. I recognised a red coat near the edge, though the printed colour had faded almost to brown. “The editor starts early,” the woman said. I took a business card and left without giving my name.\n\nNow a van rattled along the seafront. Its headlights slid over the ticket office, briefly filling the windows with a light that did not belong to morning. I shifted the envelope to my other arm. The flap had begun to lift where I had pressed it shut too quickly. I smoothed it with my thumb and looked away from the steps.\n\nThree winters earlier, those steps had disappeared under water. Rain struck the harbour lamps sideways, and the wind kept taking pieces out of every shouted sentence. My brother was beside me, his red coat zipped to his chin. We had been sent to fetch the last stack of chairs from the sailing club. When a shout came from the water, he dropped his end of the stack. The chairs fell with a noise I could still hear whenever metal scraped against stone. He ran towards the sound. I stayed beneath the club's awning, holding a single chair against my chest. Later, a boat engine covered everything else. A man wrapped a blanket around my brother, and another man asked us questions while his pen shook in the rain.\n\nThe bakery lights came on. A woman carried a tray towards the counter and paused to push back a strand of hair with her wrist. I could smell warm bread even from the pavement. Ordinary things continued to happen around me with an efficiency that felt almost rude. I checked the time. Seven minutes remained before the editor was due.\n\nLast autumn, my brother had come home for one night. At dinner, Mum asked about his new job and Dad complained about the train fare. Nobody mentioned the harbour. Later, I found him in the kitchen rinsing two mugs. His red coat hung on the chair behind him, one cuff repaired with darker thread. “You still draw?” he asked. I nodded towards the sketchbook on the table. He turned a page with his dry hand and smiled at a crooked drawing of the ticket office. Then the taxi sounded outside. He closed the book carefully, as if it contained something that might spill.\n\nA key scraped in the newspaper office door. The editor stepped inside, switched on a lamp and lifted the blind. I crossed the road before he could disappear further into the building. My shoes sounded too loud on the empty pavement. At the entrance I stopped, took the envelope from under my arm and flattened its bent corner one final time. Through the glass, he raised a questioning hand.\n\nI had come to return a rescue to the person who had made it. Three years ago, the reporter had mistaken my name for my brother's; frightened and pleased, I had let the mistake stand. Inside the envelope were my correction and the certificate that had hung above my desk ever since. The harbour behind me still looked like pale glass, but it was no longer a surface I could hide behind. I knocked.",
    "notation": false
  },
  "y11-english-creative/practice-9-Edexcel-core": {
    "question": "10 — Creative Writing Mastery: Plan efficiently. You have 40 minutes to write a 900–1000 word short story. Plan a detailed outline that shows efficient planning for structure, pace and character development. Your plan should include: a clear three-act outline with the main events in each act a character profile for the protagonist and one key secondary character the setting and how it shapes mood and tension the chosen narrative viewpoint and how it may shift a scene-by-scene outline indicating what each scene reveals about character or theme a list of literary and linguistic techniques you intend to use and how they support the plan a note on the turning point or twist and how you will reveal it Your plan may be written as bullet points or short paragraphs.",
    "hint": "Think about where tension comes from and how you can reveal information gradually through planning.",
    "working": [
      "Step 1 – Decide the core idea, audience and the tone you want for the story plan.",
      "Step 2 – Map out a three-act structure with key events and turning points for each act.",
      "Step 3 – Create a protagonist and one strong secondary character with clear motivations and stakes.",
      "Step 4 – Choose a setting and note how atmosphere, time of day, and place affect mood and pace.",
      "Step 5 – Decide on the narrative viewpoint and how it might shift between scenes to heighten suspense.",
      "Step 6 – Outline scenes one by one, stating what happens, what is learned about characters, and how each scene moves the plot.",
      "Step 7 – List techniques you will use (imagery, dialogue, sentence length, motif) and explain how each supports pace and mood.",
      "Step 8 – Identify the turning point or twist and describe how you will reveal it to readers through the plan."
    ],
    "answer": "Sample plan for a 900–1000 word short story Core idea and tone A late summer return to a small seaside town where a young narrator uncovers a family secret that reframes a long-held memory. The tone blends reflective mood with growing tension as events unfold, finishing with a restrained sense of closure. Protagonist and secondary character Protagonist: Mia, 17, thoughtful, wary of letting others in, keen to uncover truth but careful with consequences. Secondary character: Lucas, Mia’s cousin, 18, pragmatic and protective, recently returned to town, has knowledge Mia realises she may not want to confront. Three-act outline Act 1: Return and routine. Mia arrives back to the town, notices subtle changes, and starts noticing objects and places that echo a memory. She resolves to figure out why things feel unsettled, setting the goal of uncovering the truth behind a long-ago family incident. Act 2: Discovery and hesitation. Mia uncovers a clue (a letter or kept photograph) that hints at a buried family secret. Tension rises as she debates whether to confront the truth or walk away, and Lucas provides a counterpoint to Mia’s impulse to uncover. Act 3: Realisation and restrained resolution. Mia faces the twist and decides how to respond. The truth reframes her memory but does not erase it; the ending settles into a measured, hopeful tone rather than a neat answer. Character profiles Mia: age 17, curious, cautious, and morally loyal. Motivated by a need to understand her past to better live in the present. Lucas: age 18, steady and direct, acts as a foil to Mia’s hesitations but ultimately supports a decision that protects relationships. Setting and mood Setting: a quiet coastal town at early evening, with familiar places that feel both comforting and claustrophobic as secrets emerge (empty pier, wind-whistling cottages, a familiar shop with a locked drawer). Mood: starts calm and nostalgic, shifts to tense and claustrophobic, then resolves with a tempered sense of relief and acceptance. Narrative viewpoint and shifts Primary viewpoint: first-person from Mia, close to her thoughts and sensory detail. Keep the first-person viewpoint throughout. Reveal Lucas’s perspective through his dialogue and actions; Mia cannot directly narrate his unspoken thoughts. Scene-by-scene outline Scene 1: Mia arrives, notices small changes; a place that once felt safe now hints at something hidden. What Mia thinks about the town reveals her internal need to control her memory. Scene 2: Mia discovers a clue (a letter or photograph) that points to a family secret. Dialogue with Lucas starts to reveal conflicting memories. Scene 3: Mia confronts a family elder or visits a meaningful location; tension rises as she weighs truth against loyalty. Scene 4: The twist is hinted through a specific object or memory that reframes the past. Mia’s narration contrasts memory with present reality. Scene 5: Mia makes a decision about how to respond to the reveal, choosing a path that honours truth while protecting relationships. Resolution is quiet and hopeful. Techniques and rationale Imagery: coastal details to create mood and to echo Mia’s shifting emotions. Short, controlled sentences during tense moments to accelerate pace; longer sentences for reflection in memory-driven sections. Dialogue: selective and purposeful to reveal character and to surface truth without exposition. Motif: recurring image (the tide or a locked drawer) to signal memory and revelation. Structure: three-act plan with a deliberate turning point that pivots Mia’s understanding. Turning point and reveal Turning point: the moment Mia learns the core truth behind the family incident, reframed memory rather than a complete undoing. Reveal method: through a discovered object and a brief, charged conversation that reframes Mia’s memory; resolution follows with acceptance and a plan for moving forward.",
    "notation": false
  },
  "y11-english-fiction/exam-0-Edexcel-core": {
    "question": "Read this original teaching passage. Infer Mia’s conflict about her future and the decision she seems to be approaching. Use at least two pieces of evidence and explain how they work together.\n\nAt the station, Mia kept her college acceptance letter folded inside the timetable. The train to the city waited with its doors open. On her phone, a message from Dad glowed: “We could use you at the shop today.” She typed “I’m coming”, deleted it, then looked towards the empty seat by the window. When the whistle sounded, she lifted her bag. The letter stayed in her hand.",
    "marks": 4,
    "markScheme": [
      "Identifies conflict between a new educational opportunity and family responsibility.",
      "Uses the acceptance letter and the message about the shop as evidence.",
      "Infers that she may be preparing to board, using the lifted bag and attention to the train.",
      "Combines the details while acknowledging that the passage stops before confirming her final action."
    ],
    "answer": "Mia seems torn between taking up college and helping her family: the acceptance letter represents an opportunity, while Dad’s message calls her back to the shop. Deleting “I’m coming” suggests she is resisting an immediate promise to return. Looking at the train seat and lifting her bag together imply a move towards boarding. However, the passage ends before she actually boards, so the decision remains an inference rather than a confirmed event.",
    "notation": false
  },
  "y11-english-fiction/practice-3-Edexcel-core": {
    "question": "Read the extract below, then answer the question that follows. The extract: At the station, the rain would not decide if it wanted to spit or spill, so it did both, a murmur on the platform tiles. I carried the worn envelope in my pocket, the one with the tight seal and the blue ink that had never dried. Inside were letters my mother had written to my grandmother, and a single photograph that somehow smudged when I pressed it. The clock in the hall kept time in a way that seemed to measure how long it took for the house to remember me. In the kitchen, the kettle clicked three times, as if counting the moments since the last guest arrived. On the mantelpiece stood a tin box, dented and dusty, tied with a ribbon that had faded to pale green. I opened it, and the letters spilled out like small birds, each one begging me to listen. My grandmother's handwriting swam on every page, a hand that once dictated the rooms of this house. I read a line where she assured my mother that everything would be alright, and I felt something tighten in my chest, as if a thread were being pulled from a coat I no longer wore. Explain, with close reference to the passage, two inferences about how the speaker feels about the past and explain how the writer's imagery and detail support these inferences. You should use quotes from the passage to support your answer.",
    "hint": "Think about what the objects and sounds in the extract reveal about memory and emotion.",
    "working": [
      "Step 1 – The description of the tin box as “dented and dusty, tied with a ribbon that had faded to pale green” suggests that memories are cherished but worn by time, indicating a bittersweet, protective feeling toward the past.",
      "Step 2 – The line “the letters spilled out like small birds” and the phrase “everything would be alright” followed by “I felt something tighten in my chest” signal a mix of tenderness and unease, showing the past both attracts and unsettles the speaker.",
      "Step 3 – The repeated domestic details (the rain, the clock, the kettle clicking three times, the house remembering the speaker) indicate that memory dominates the present, implying that the past exerts ongoing influence over the speaker’s emotions and activities.",
      "Step 4 – Synthesis: The two inferences are (a) the speaker feels a tender longing for family and for what has been lost, tempered by possible unease or emotional burden; and (b) the past holds power over the present, drawing the speaker back into memory and shaping their mood and actions."
    ],
    "answer": "First, the speaker seems drawn to family memories. The simile of letters spilling “like small birds” makes the past seem lively and eager for attention, while the preserved tin box suggests attachment. Second, those memories are emotionally unsettling: “something tighten in my chest” suggests tension or pain, and the image of a thread pulled from a coat implies disturbance to an older identity. Guilt is possible, but the extract does not establish a wrongdoing. Together, the details present the past as both attractive and difficult to confront.",
    "notation": false
  },
  "y11-english-fiction/practice-9-Edexcel-core": {
    "question": "Read the extract below. Using evidence from the passage, explain how the note and setting create uncertainty for Lila and the reader. Distinguish supported inferences from details the extract does not establish. \"The clock in the corridor ticked louder than usual as Lila waited for the final bell. In the library, the desk lamp threw pools of yellow light across the tables, and the rows of books pressed in close as if listening. On her desk she had found a folded note that morning: 'Meet me where the light is weakest.' Now the stair creaked and a shadow slid along the shelf, but when Lila looked up, the head librarian was locking the door and whispering that there was no one else in the building.\"",
    "hint": "Compare the note, the shadow and the librarian’s statement. What remains unknown?",
    "working": [
      "The invitation to meet where light is weakest suggests secrecy.",
      "Listening books and a louder clock create a watchful, tense atmosphere.",
      "The shadow conflicts with the librarian’s claim that nobody else is there.",
      "The passage does not identify the writer, establish trust or show Lila going to a meeting."
    ],
    "answer": "The note’s instruction, “Meet me where the light is weakest,” suggests a secret encounter without revealing who arranged it. The books seem to be “listening,” making the setting feel watchful, while the creak and moving shadow suggest a possible presence. The librarian’s statement that “there was no one else” leaves that impression unresolved. Lila looks up, but the extract does not show her attending a meeting or tell us that she knows or trusts the writer. Those remain possibilities, not established facts.",
    "notation": false
  },
  "y11-english-lang-nonfiction/exam-1-Edexcel-core": {
    "question": "The two extracts below are original teaching texts with fictional speaker roles. Research claims are part of the rhetoric to evaluate, not verified evidence. Compare how Text A and Text B present their views on the use of smartphones in schools. In your answer, compare how the writers shape their perspectives through language (word choice, tone, imagery) and structure (opening statements, development of argument, conclusion). Use quotes from Text A and Text B to support your points. You should refer to both texts throughout, showing similarities and differences in approach.\n\nTEXT A: From a newspaper column by a parent. I found my daughter at two in the morning, lit blue, thumbing through the opinions of strangers. She is fifteen. She had school in five hours. We have handed a generation a device that never sleeps and then wondered aloud why they are tired, anxious and thin-skinned. I am not nostalgic for a world without phones; I am simply asking who decided that childhood should be conducted in public, and when exactly we agreed to it.\n\nTEXT B: From an article by an education researcher. The debate about phones in schools generates more heat than light. Schools that ban them report calmer corridors, and that finding is real. But the studies that follow pupils beyond the school gate find the same anxiety after school as before, which suggests a ban moves the problem rather than solving it. If we want young people to manage a device they will carry for the rest of their lives, the lesson has to happen somewhere. A locked box teaches nothing at all.",
    "marks": 6,
    "markScheme": [
      "Identify A’s anxious parental perspective with accurate evidence.",
      "Analyse one language choice in A and its effect.",
      "Identify B’s challenge to bans as a sufficient solution with accurate evidence.",
      "Analyse one language choice in B and its effect.",
      "Compare how the extracts develop their arguments structurally.",
      "Offer a supported comparison of purpose or reader response, recognising that an asserted research claim is not verified by assertion."
    ],
    "answer": "A begins with a personal scene: the daughter is “lit blue” at two in the morning. This visual detail makes the concern immediate, while “She is fifteen” isolates her age in a short sentence to stress vulnerability. The device that “never sleeps” is personified as a relentless presence. A then moves from one child to a wider question about childhood being “conducted in public,” inviting parental concern rather than setting out a precise school policy.\n\nB begins by criticising debate that produces “more heat than light,” a metaphor contrasting emotion with understanding. The writer concedes that bans can produce “calmer corridors,” then uses “But” to question whether school restrictions solve wider problems. The final short sentence, “A locked box teaches nothing at all,” compresses the argument into a forceful image of restriction without education.\n\nBoth writers are concerned about young people, but A appeals chiefly through personal anxiety while B argues for learning to manage devices. B’s references to studies give an appearance of evidence; because no studies are identified in this fictional extract, their conclusions should not be treated as established research.",
    "notation": false
  },
  "y11-english-lang-nonfiction/exam-2-Edexcel-core": {
    "question": "These are original teaching opinion pieces. Analyse their rhetoric rather than assuming every assertion is proven. Text A: If we don't act now, plastic will choke our beaches, our wildlife, and the future we leave to children. This is not about politics; it is about responsibility. Every bottle you recycle, every bag you refuse, makes a difference. Discarded plastic can reach the sea and damage marine habitats. But there is hope: communities that have introduced simple changes—more public recycling bins, a small charge on single-use bags—have reduced litter and cut waste. The message is simple: small actions add up. If we want a cleaner coast and healthier wildlife, we must start at home. Text B: Some people argue that recycling is a costly distraction, and that individual actions won't fix a problem caused by big industries. They say that governments should impose strict regulations on producers and invest in better waste processing instead of blaming citizens for 'green guilt'. They claim that most plastic ends up in landfills anyway, and that the 'war on plastic' can distract from other essential issues like jobs in manufacturing. While there is truth in some complaints, the burden cannot be left entirely to households; the cost of inaction is higher. If policy makers do not act, we may all pay the price later. Evaluate how the writers have used methods to influence the reader. Compare how each writer uses language, structure and presentation to convey their viewpoints. You should refer to both texts and consider how arguments are framed, use of emotive language, counter-arguments, and the overall tone and stance conveyed by each writer.",
    "marks": 4,
    "markScheme": [
      "Identify a persuasive language method used by Text A (e.g., emotive language or direct address) and explain its effect on the reader.",
      "Identify a method used by Text B (e.g., presenting a counter-argument and the phrase 'green guilt') and explain its effect on the reader.",
      "Compare how structure and presentation in the two texts influence reader engagement and the perceived strength of each argument.",
      "Make a justified judgement about which writer’s methods are more effective overall and support it with evidence from both texts."
    ],
    "answer": "A’s verb “choke” personifies harm to beaches and creates alarm. The repeated opening “Every” directs attention to achievable individual actions, before the closing appeal to “start at home” gives the argument a clear destination. B opens with other people’s objections, signalled by “Some people argue” and “They say.” The phrase “green guilt” represents a criticism of placing responsibility on individuals; it is not simply B mocking people who oppose recycling. B then concedes that there is “truth in some complaints” and argues that households should not carry the burden alone. Structurally, A moves from threat to personal action, while B moves through objections towards shared political responsibility. A may be more immediate for a reader seeking a personal next step; B may persuade a reader concerned about systemic causes. Either judgement needs a stated criterion, and neither text’s assertions become proven facts merely through confident wording.",
    "notation": false
  },
  "y11-english-lang-nonfiction/practice-8-AQA-core": {
    "question": "Evaluate how the writer of this original teaching extract uses emotive language, statistics, direct address and structure to persuade. Use short quotations and the numbered lines. The local survey is fictional and should not be treated as real research.\n\n1. Plastic litters the shore, catching in seaweed and snagging on rocks.\n2. In our imaginary beach survey, 60 of the 100 pieces of litter collected were plastic.\n3. A discarded bag trembled like a warning flag beside the tide.\n4. You might think this is someone else’s problem, but this is our beach.\n5. What sort of shoreline do we want tomorrow’s children to inherit?\n6. Some people say one household cannot change anything.\n7. Yet we can choose reusable bags, sort our waste carefully and ask shops to reduce packaging.\n8. Let us leave footprints on the sand, not a trail of rubbish.",
    "hint": "Think about where the writer tries to make you feel something, where facts are used to back up claims, and where you are addressed directly.",
    "working": [
      "Line 2 quantifies the fictional sample, but does not establish a regional or global rate.",
      "The simile in line 3 and question in line 5 create concern.",
      "Direct address in line 4 involves the reader.",
      "Lines 6–8 move from an objection to practical actions and a memorable contrast."
    ],
    "answer": "The fictional statistic, “60 of the 100 pieces” (line 2), makes the argument sound concrete, but it describes only the stated sample. The bag “like a warning flag” (line 3) turns litter into a signal of danger. Direct address in “You might think” (line 4) challenges distance from the problem, while “our beach” invites shared responsibility. The question about “tomorrow’s children” (line 5) appeals to concern for the future. Structurally, line 6 introduces an objection before line 7 offers practical actions. The contrast between “footprints” and “rubbish” (line 8) leaves a memorable image of the choice the writer wants readers to make. These methods may motivate action, although persuasive force does not establish the reliability or representativeness of a statistic.",
    "notation": false
  },
  "y11-english-lang-nonfiction/practice-9-Edexcel-core": {
    "question": "The following original teaching sources contain illustrative estimates and a fictional policy proposal. They are not current statistics or a real government announcement. Source A: An estimated 8 million tonnes of plastic are entering the world's oceans every year. Plastic waste can persist for centuries, breaking into microplastics that are eaten by fish and marine life. Seabirds and sea turtles have stomachs full of plastic, and coastal communities rely on healthy seas for fishing and tourism. Source B: The government proposes banning single-use plastics, improving recycling facilities, and introducing a bottle-deposit scheme. They stress that reducing plastic use is essential for the health of oceans and fisheries. Projections suggest that if recycling rates improve and consumption of single-use plastics falls, plastic entering the sea could fall by as much as 40% within ten years. The article emphasises urgency and uses inclusive language: “we can”, “the time to act is now”. Question: Synthesize information from both sources to identify (i) two concerns about plastic pollution that appear in both sources, (ii) two differences in emphasis between the sources, and (iii) two examples of language used to persuade. Conclude with a judgement about which writer provides stronger support for action, using quotes from both sources as evidence.",
    "hint": "Look for points that appear in both sources and note how the language shifts the reader.",
    "working": [
      "Both sources express concern about ocean health and fishing or fisheries.",
      "A focuses on damage and persistence; B focuses on proposed policies and a conditional projection.",
      "Analyse A’s wildlife imagery and B’s inclusive we can.",
      "Judge persuasiveness with an explicit criterion while recognising that the estimates have no supplied supporting method."
    ],
    "answer": "Both sources express concern about the health of the sea and fishing: A refers to “healthy seas for fishing and tourism,” while B refers to “the health of oceans and fisheries.” A explicitly describes wildlife harm; B’s broader wording does not describe the same animals. Livelihood effects are suggested through fishing, rather than fully explained in both sources.\n\nA emphasises the scale and persistence of pollution, while B emphasises policy responses and a possible future reduction. A’s image of animals with “stomachs full of plastic” can provoke distress; B’s “we can” creates a sense of shared agency. I find B more useful for identifying possible actions because it names recycling facilities and a deposit scheme. However, its “could fall” projection is conditional, and no method or evidence is supplied for the percentage. A’s vivid account establishes an emotional reason to care; neither fictional source alone proves the effectiveness of the proposed policies.",
    "notation": false
  },
  "y11-english-lang-transactional/practice-5-Edexcel-core": {
    "question": "Use rhetoric accurately in transactional writing. You are the Year 11 Student Council president. Write a persuasive letter to the headteacher requesting funding for a new quiet study space in the school library to be used after school. In your letter, explain why the space is needed, what it will include, and how it will help students and the school. Include at least three rhetorical devices (for example, anaphora, triadic listing, and a rhetorical question) to persuade the reader.",
    "hint": "Focus on clear, polite persuasion and place emphasis on outcomes for students and the school.",
    "working": [
      "Step 1: Identify audience and purpose.",
      "Step 2: Plan structure (opening, need, features, benefits, call to action, closing).",
      "Step 3: Decide on rhetorical devices (anaphora, triadic list, rhetorical question) and where to place them.",
      "Step 4: Draft the letter in formal, campus-appropriate tone.",
      "Step 5: Review for clarity, formality and use of devices."
    ],
    "answer": "Dear Headteacher,\n\nI am writing on behalf of the Year 11 Student Council to request funding for a new quiet study space in the school library, to be available after school.\n\nWe need this space because many students require a calm place to focus on homework and revision, especially during exam season. We need a place where concentration can grow and confidence can rise.\n\nTo make this a reality, the space would include a quiet zone with desks for individual work, soft lighting, and sound-absorbing panels. It will benefit students, teachers and the school: it could support attainment through better revision, support wellbeing by reducing distractions, and demonstrate the school's commitment to inclusive learning for all. Who would benefit more than a student trying to revise after a full day of lessons?\n\nPlease consider funding this pilot project for one term and let us know how we might proceed. Thank you for your time and consideration.\n\nYours sincerely,\nAlex Carter\nYear 11 Representative, Student Council",
    "notation": false
  },
  "y11-english-lang-transactional/practice-7-AQA-core": {
    "question": "8 Write an article for your school newspaper arguing for or against the proposal to ban smartphones in lessons. Your article should be well organised and easy to follow, with an introduction that states your stance, body paragraphs that develop your argument with reasons and examples, a paragraph addressing a counter-argument, and a concise conclusion. Use paragraphs to show the progression of your argument and use signposting phrases (for example, firstly, on the other hand, in conclusion). Aim for about 650–750 words.",
    "hint": "Plan the order of your points: start with a strong reason, then add supporting detail, then address the opposing view, and finish with a clear verdict.",
    "working": [
      "State a qualified position against unrestricted personal-phone use during lessons.",
      "Develop reasons about attention and independent work, with clearly hypothetical examples.",
      "Consider educational benefits, accessibility and how an exception process could work.",
      "Address an opposing argument, practical implementation and evidence for reviewing the proposal.",
      "Conclude with a clear recommendation and signposted paragraphs."
    ],
    "answer": "Keep Lessons Focused\n\nIn my view, unrestricted use of personal smartphones should not be allowed during lessons. This is a proposal for our school to consider, not a claim that every phone causes trouble or that one rule will solve every classroom problem. The purpose is to protect time for learning while recognising that some pupils may need an agreed exception. A sensible policy should be clear enough to follow and flexible enough to support legitimate needs.\n\nFirstly, a phone can create an additional demand on attention. Imagine trying to explain a difficult idea while messages keep appearing beside your exercise book. Even if you do not reply, deciding whether to look can interrupt the task. Keeping personal phones out of sight during ordinary lessons would remove one avoidable temptation. That does not guarantee perfect concentration, but it gives pupils and teachers one less competing activity to manage. The argument is about the learning environment, rather than blaming pupils for being interested in their friends.\n\nSecondly, independent work matters. If a task asks us to develop an explanation, instantly searching for a finished answer can prevent us from discovering where our understanding is incomplete. A phone-free period could encourage pupils to attempt the problem, discuss it appropriately and ask for help. Teachers would still need to design worthwhile tasks and explain when research is useful. Removing a device cannot replace good teaching, and copying can happen without a phone, but clear expectations make the purpose of independent work easier to understand.\n\nOn the other hand, smartphones can be useful tools. Dictionaries, translation applications and access to information may support learning. Some pupils may also use technology for an agreed medical or accessibility need. These points deserve a practical response. The school could provide suitable alternatives for planned digital tasks and agree individual arrangements where needed. An exception should not require a pupil to explain private circumstances to the whole class. Staff should know how to apply the arrangement consistently, so support does not depend on an argument at the classroom door.\n\nAnother objection is that young people need to learn self-control rather than simply have devices removed. I agree that managing technology is a skill worth teaching. However, learning a skill does not require unrestricted practice in every situation. We learn when to speak during a discussion; we can also learn when a device serves the task and when it interrupts it. Lessons about evaluating information, privacy and online conduct could continue alongside limits on ordinary phone use. The rule and the education should reinforce each other, rather than compete.\n\nPractical details would determine whether the proposal succeeds. Students and families should know where phones would be kept, how urgent messages would reach pupils and who would handle a problem. Secure storage and fair procedures would need planning before any trial began. A policy announced without these arrangements could create extra disruption or place an unreasonable burden on staff. The school should consult pupils, parents and teachers, including those whose needs may be less obvious, and publish a simple explanation that everyone can understand.\n\nFor the trial to be fair, expectations must apply consistently across classes. Pupils should receive a calm reminder and a clear explanation of the next step, rather than an unpredictable response. Teachers should also be able to report practical difficulties promptly. Listening to those experiences would make revision of the policy possible.\n\nFinally, the proposal should be reviewed rather than defended regardless of its results. During a trial, the school could gather pupil and staff feedback, note interruptions and examine whether the arrangements create new difficulties. Those observations would not automatically prove a cause, but they could help identify improvements. In conclusion, I support limiting personal-phone use during lessons, with planned educational use and agreed individual exceptions. The aim is sustained attention and useful learning. A clear, fair and reviewable approach offers a stronger starting point than either unrestricted access or a rule that ignores how classrooms actually work.",
    "notation": false
  },
  "y11-english-modern/exam-0-AQA-core": {
    "question": "Read the extract below about a school debate on extending the school day. The headteacher proposes an extra hour for tutoring and clubs to help students catch up. Some students worry about after-school work and caring responsibilities. Using this extract, write a persuasive argument for or against extending the school day. In your answer, present a clear position, quote short phrases from the extract to support your points, explain how the writer's language and structure build the argument, and consider one counter-argument. Extract: \"Morning light seeped through the blinds as the assembly listened to the head teacher propose a longer school day. 'With an extra hour, we can run more tutoring, more clubs, more chances to catch up,' she said, tapping the timetable on the desk. A chorus of nods rose, yet I noticed the scuff of shoes and the whisper of arguments starting in the back rows. The science teacher, Mrs Carter, chimed in, 'Extending hours isn't enough; we need better materials and safer routes home.' A boy stood up, 'Some of us work after school. Some of us take care of siblings. We can't do more if we can't get there.' The head paused, then added, 'This is about equity—making sure no one falls behind.' The room shifted, like a boat finding wind. I thought about the buses, the late dinners, the minutes of quiet I steal to read. If the extra hour brings relief to some, but costs others, is the change fair? The debate continued, the clock ticking toward a future we would share or resist.\"",
    "marks": 6,
    "markScheme": [
      "Identifies a clear position (for or against) and maintains it throughout.",
      "Uses evidence from the extract with quotation marks to support points.",
      "Analyses language choices (tone, emotive language, questions) and explains how they persuade.",
      "Considers at least one counter-argument and provides a reasoned rebuttal.",
      "Presents ideas in logical sequence with paragraphing and clear structure.",
      "Demonstrates accurate spelling, punctuation and appropriate vocabulary."
    ],
    "answer": "Against extending the school day. The extract makes a strong case that longer hours are not a universal remedy. The opening idea—'With an extra hour, we can run more tutoring, more clubs, more chances to catch up'—presents a tempting vision, but the narrator asks, 'If the extra hour brings relief to some, but costs others, is the change fair?' This questions whether extra time benefits all pupils. This doubt shows that any policy must consider uneven needs rather than simply adding hours. Further, the voices of pupils facing practical obstacles—'Some of us work after school. Some of us take care of siblings. We can't do more if we can't get there'—highlight a disproportionate burden. This use of direct speech personalises the issue and makes the reader feel the stakes beyond test scores. The phrase 'This is about equity—making sure no one falls behind' reframes the debate as a fairness issue; the writer uses the word 'equity' to appeal to shared values and to press governors to think of the consequences for the most vulnerable. The extract also uses language to carry a mood of tension and caution: 'The room shifted, like a boat finding wind' uses a simile to suggest uncertainty about the proposal's direction. The counter-argument about resources and safety from Mrs Carter—'we need better materials and safer routes home'—is introduced to prevent a simplistic yes. In a full argument, these lines would be acknowledged and rebutted by noting that more time could do some good only if accompanied by sufficient staffing, materials, and reliable transport. Conclusion: Given the costs to families, transport, and well-being, extending the day risks creating more stress and unfairness than it solves. A balanced approach—targeted support, better resources, and flexibility—would be fairer and more effective.",
    "notation": false
  },
  "y11-english-modern/exam-1-Edexcel-core": {
    "question": "Read this original teaching extract. Analyse how language and structure present the narrator's emotional journey on arriving in a new town. Discuss at least two language features and two structural choices.\n\n1. The bus smelled of damp plastic; its seats jolted as we entered town.\n2. It is just a place, I told myself. Just bricks. Just roads.\n3. At school, the corridors echoed with names I could not yet attach to faces.\n4. I stood still, holding a quiet ache, a knot I could not untangle.\n5. Everyone else seemed to know where the stairs would lead.\n6. My folded timetable was a map of nerves in my pocket.\n7. Then a girl smiled and asked if I needed help.\n8. I followed her, listening to our footsteps find the same uneven rhythm.",
    "marks": 6,
    "markScheme": [
      "1 mark: identifies the sensory detail of damp plastic or jolting seats.",
      "1 mark: explains how this establishes physical discomfort and unease.",
      "1 mark: identifies and explains a metaphor such as “a knot” or “a map of nerves”.",
      "1 mark: explains how the short fragments in line 2 emphasise attempted self-reassurance.",
      "1 mark: identifies the social contact in line 7 as a structural turning point.",
      "1 mark: explains the tentative connection suggested by the final shared footsteps."
    ],
    "answer": "The smell of “damp plastic” and the jolting seats make the arrival physically uncomfortable, reflecting the narrator's unease. The metaphor “a knot I could not untangle” makes anxiety feel difficult to resolve, while “a map of nerves” transforms the timetable from a practical aid into an image of uncertainty.\n\nThe fragments “Just bricks. Just roads.” break up line 2, suggesting an insistent attempt at self-reassurance. The narration then pauses on standing still before “Then” introduces a turning point: another pupil offers help. The final shared footsteps suggest a first connection, although their “uneven rhythm” keeps the optimism tentative.",
    "notation": false
  },
  "y11-english-modern/practice-9-Edexcel-core": {
    "question": "Read this original modern-fiction teaching extract. Build an analytical argument about how the writer presents the library as important to Mara. Use precise quotations and analyse methods. This is transferable practice, not an extract from an official set text.\n\nMara stopped beneath the library clock. The council notice was white and sharp against the brown door: CLOSURE PROPOSED. Behind the glass, the lamps still made their small circles on the desks. Here, nobody asked her to turn down the television, mind the baby or hurry up. Here, she could hear a sentence finish inside her head. She pressed her unfinished homework against her coat and read the notice again.",
    "hint": "Develop a claim about what the library offers Mara, using the contrast and repetition.",
    "working": [
      "State a clear analytical argument about refuge and independence.",
      "Analyse the sharp notice against the warm interior details.",
      "Explain the repetition of Here and the list of demands elsewhere.",
      "End by connecting the unfinished homework to the threatened opportunity."
    ],
    "answer": "The writer presents the library as a threatened space for Mara’s independence. The notice is “white and sharp,” contrasting with the lamps’ “small circles,” which suggest limited but welcoming areas of light. This contrast makes closure feel intrusive rather than merely administrative. The repeated “Here” emphasises what this particular place offers her, while the list of demands about television, childcare and hurrying suggests pressures elsewhere. The phrase “hear a sentence finish inside her head” makes uninterrupted thought sound like something valuable she rarely has. Finally, her “unfinished homework” connects the threat to an immediate need. The extract therefore makes the library’s importance personal and concrete without needing to claim that every resident experiences it in the same way.",
    "notation": false
  },
  "y11-english-poetry/exam-4-AQA-core": {
    "question": "Read this original teaching poem, Park at Dusk. Analyse how the poem presents mood and memory.\n\nThe park at dusk wears a cloak of purple light,\nand shadows murmur like old names on a page.\nA swing creaks softly, remembering laughter bright,\nwhile distant cars become a tide on the stage.\nThe sky spills gold where clouds have learned to ache,\nand puddles catch a star that slips away.\nI walk the path where my small feet once woke,\nas night folds around the benches in grey.\nThe river speaks in a whispering, silver thread,\nand streetlamps blink in patient, patient time.\nMy breath makes little clouds, a pale, pale thread,\nand memory nods from corners like a rhyme.",
    "marks": 6,
    "markScheme": [
      "1 mark: offers an interpretation that addresses the task.",
      "1 mark: selects a relevant exact quotation.",
      "1 mark: explains a language choice and its effect.",
      "1 mark: identifies a structural feature present in the displayed poem.",
      "1 mark: explains its effect on the interpretation.",
      "1 mark: develops or qualifies the interpretation using a second relevant detail."
    ],
    "answer": "The park “wears a cloak of purple light”, personification that makes the setting feel covered and transformed by dusk. The comparison of shadows to “old names on a page” connects the present scene with remembered people.\n\nSound also prompts memory: the swing “creaks softly”, and its personified act of “remembering” brings absent laughter into the quiet park. “My small feet once” implies that the speaker knew the place in childhood.\n\nThe twelve lines form one continuous stanza. Sentences generally extend across pairs of lines, with commas encouraging pauses before the sentence-ending full stops. Repeated words in “patient, patient” and “pale, pale” slow and emphasise the description; they should be identified as repetition.\n\nThe closing personification, “memory nods”, gives recollection a companionable presence. Alongside words such as “ache” and “slips away”, it suggests affection mixed with loss rather than uncomplicated happiness.",
    "notation": false,
    "hint": "Use the displayed line breaks and punctuation, and support each interpretation with an exact quotation."
  },
  "y11-english-poetry/practice-1-Edexcel-core": {
    "question": "Read this original teaching poem, Winter Window. Analyse how form conveys memory and mood.\n\nThrough the glass, the city fades to white.\nA passing bus leaves ribbons in the snow.\nI hold your photograph against the light\nand watch the face I almost used to know.\nThe clock ticks twice. I set the picture down.\nBeyond the pane, more snow conceals the town.\n\nI turn the photograph. Your careful name\nis written underneath a summer tree.\nThe room is cold; the ink is still the same,\nand brings that distant afternoon to me.\nOutside, the bus has vanished round the bend.\nI read your name, then read your name again.",
    "hint": "Use the displayed line breaks and punctuation, and support each interpretation with an exact quotation.",
    "working": [
      "Two six-line stanzas give the poem a balanced shape. The first centres on looking at the photograph; the second begins with turning it over, marking a movement towards the name and a remembered summer.",
      "Enjambment carries “Your careful name / is written” across lines 7–8, delaying the information about where the name appears. The full stop inside “The clock ticks twice. I set” creates a pause within line 5.",
      "The final repetition of “read your name” suggests the speaker is reluctant to let the memory go. The repeated act gives the ending a lingering quality rather than complete emotional closure."
    ],
    "answer": "Two six-line stanzas give the poem a balanced shape. The first centres on looking at the photograph; the second begins with turning it over, marking a movement towards the name and a remembered summer.\n\nEnjambment carries “Your careful name / is written” across lines 7–8, delaying the information about where the name appears. The full stop inside “The clock ticks twice. I set” creates a pause within line 5.\n\nThe final repetition of “read your name” suggests the speaker is reluctant to let the memory go. The repeated act gives the ending a lingering quality rather than complete emotional closure.",
    "notation": false
  },
  "y11-english-poetry/practice-4-Edexcel-core": {
    "question": "Read this original teaching poem, First Bus. Analyse how line breaks, stanza form and punctuation shape the movement from waiting to departure.\n\nThe street lies quiet as a sealed notebook.\nA lamp stains gold across the waiting road.\nI watch the shadow of a bus unfold\nacross the wall, then tremble at my feet.\nThe doors slide back. A voice calls out my name.\nI leave the shelter, stepping into light.\nBehind the glass, the houses start to move.\nMorning begins. I take the empty seat.",
    "hint": "Use the displayed line breaks and punctuation, and support each interpretation with an exact quotation.",
    "working": [
      "The single eight-line stanza follows one continuous departure. The opening “sealed notebook” suggests stillness and something not yet begun.",
      "Enjambment between lines 3 and 4 carries the shadow “across the wall”, allowing the sentence itself to move beyond its first line.",
      "The internal full stop in “The doors slide back. A voice” interrupts the line with a distinct action and then a call. Similar punctuation in the final line divides the broad statement “Morning begins” from the small personal act of sitting down.",
      "The shift from watching in lines 1–4 to “I leave” in line 6 makes departure the turning point. The form supports this change without requiring an invented rhyme scheme or a stanza break."
    ],
    "answer": "The single eight-line stanza follows one continuous departure. The opening “sealed notebook” suggests stillness and something not yet begun.\n\nEnjambment between lines 3 and 4 carries the shadow “across the wall”, allowing the sentence itself to move beyond its first line.\n\nThe internal full stop in “The doors slide back. A voice” interrupts the line with a distinct action and then a call. Similar punctuation in the final line divides the broad statement “Morning begins” from the small personal act of sitting down.\n\nThe shift from watching in lines 1–4 to “I leave” in line 6 makes departure the turning point. The form supports this change without requiring an invented rhyme scheme or a stanza break.",
    "notation": false
  },
  "y11-english-poetry/practice-7-AQA-core": {
    "question": "Read this original teaching poem, After the Rain. Analyse how the four tercets and other formal choices shape the mood.\n\nRain taps the roof. I leave the kettle cold.\nYour coat still hangs beside the kitchen door;\nits empty sleeve repeats the shape I hold.\n\nA gutter spills its water to the ground.\nI listen for a step upon the stair\nand find the house is full of smaller sound.\n\nAt last I lift the cup you used to choose\nand set it on the shelf above the sink.\nThe rain grows faint. There is no more to lose.\n\nThe doorway fills with ordinary light.\nI turn the key and step into the street,\ncarrying your name beyond the night.",
    "hint": "Use the displayed line breaks and punctuation, and support each interpretation with an exact quotation.",
    "working": [
      "Four three-line stanzas give the poem a regular shape as the speaker moves from waiting indoors towards leaving the house. There is no separate final couplet.",
      "Within each tercet, the first and third lines rhyme: cold/hold, ground/sound, choose/lose and light/night. The repeated pattern can suggest an effort to contain grief.",
      "The internal full stops in “Rain taps the roof. I leave” and “The rain grows faint. There” divide a line into separate observations, creating pauses amid the regular stanza pattern.",
      "The final two lines continue one grammatical movement, from “step into the street” to “carrying your name”. That continuation suggests departure without abandoning remembrance."
    ],
    "answer": "Four three-line stanzas give the poem a regular shape as the speaker moves from waiting indoors towards leaving the house. There is no separate final couplet.\n\nWithin each tercet, the first and third lines rhyme: cold/hold, ground/sound, choose/lose and light/night. The repeated pattern can suggest an effort to contain grief.\n\nThe internal full stops in “Rain taps the roof. I leave” and “The rain grows faint. There” divide a line into separate observations, creating pauses amid the regular stanza pattern.\n\nThe final two lines continue one grammatical movement, from “step into the street” to “carrying your name”. That continuation suggests departure without abandoning remembrance.",
    "notation": false
  },
  "y11-english-poetry/practice-7-Edexcel-core": {
    "question": "Read this original teaching poem. It has two stanzas of six lines. Analyse how its form conveys memory and ritual: consider stanza structure, line length, pauses, repetition and the final short line.\n\nAt six the kitchen clock begins to chime.\nI set two cups beside the window seat.\nThe kettle lifts its small cloud into light;\nI wait for steps that will not cross the street.\nYour chair is still. I leave the teaspoon there,\nthen fold the cloth with slow, deliberate care.\n\nAt six tomorrow I will set the cups.\nThe room will hold the same expectant light.\nPerhaps I will not listen for your step;\nperhaps the tea will cool before the night.\nI touch the handle, letting silence stay.\nWe remember.",
    "hint": "Compare the repeated opening with the much shorter final line; explain effects using exact evidence.",
    "working": [
      "Each six-line stanza contains a domestic ritual, giving the poem a repeated shape.",
      "The repeated “At six” links the present routine with its expected continuation tomorrow.",
      "“Perhaps” repeated in the second stanza introduces uncertainty within that familiar pattern.",
      "The two-word final line is shorter than those before it and shifts from “I” to “We”, making remembering feel shared."
    ],
    "answer": "Two six-line stanzas give the poem a repeated shape, reflecting the speaker’s daily ritual. “At six” begins both stanzas, connecting today with tomorrow, while the repeated “Perhaps” makes the future less certain. Sentence-ending punctuation creates pauses within and between lines; “Your chair is still” briefly interrupts the longer movement of the first stanza. The final two-word line, “We remember”, is conspicuously short and changes the individual “I” to a shared “We”. This concentrates attention on remembrance rather than claiming the absence has ended.",
    "notation": false
  },
  "y11-english-poetry/practice-9-Edexcel-core": {
    "question": "This is classroom practice comparing two unseen poems, not a complete official examination task. Compare mood and imagery in these two original teaching poems. They are not official anthology poems. Select two comparison points and support each with brief references to both poems.\n\nPoem A: Dawn over the Street\nThe sun slips up the blinds and softly spills the street,\nA kettle sighs its steam, the kettle’s care gone neat.\nThe river wears a gold thread along its edge,\nA quiet city wakes with a patient pledge.\nBirds twirl on wires, the day begins to hum,\nThe paper’s white corners bloom and become.\nShoes click in a rhythm, a gentle, steady pace,\nAnd morning holds its breath in warm, unhurried grace.\n\nPoem B: Storm in the Harbour\nThe harbour gnaws at rain, the gulls turn pale and loud,\nWaves spill their salt across the battered cloud.\nShutters clap like hands in a crowded hall,\nThe lighthouse stutters, blinking, brave and small.\nSmoke climbs from chimneys, a wreath of grey,\nThe wind threads ropes of silver through the spray.\nYet through the roar, a stubborn beating heart\nKeeps time with the harbour’s pulse, from end to start.",
    "hint": "Focus on mood, imagery and the feel of the lines; compare how the poems move from calm to tension.",
    "working": [
      "Compare the gentle personification of morning with the aggressive personification of the harbour.",
      "Support the contrast with softly and gnaws.",
      "Compare the human activity in A with the resilient heartbeat in B.",
      "Do not infer metre solely from a line saying rhythm."
    ],
    "answer": "First, the poems give the surroundings contrasting moods. A’s sun “softly spills” and its morning “holds its breath,” creating gentle anticipation. B’s harbour “gnaws” and its shutters “clap,” suggesting aggression and disturbance. Second, both connect place to human life. A’s clicking shoes and kettle make an ordinary morning feel companionable; B’s “stubborn beating heart” suggests endurance within the storm. The contrast is therefore not simply calm versus fear: B also creates a sense of resilience.",
    "notation": false
  },
  "y11-english-shakespeare/exam-9-Edexcel-core": {
    "question": "This is a short skills exercise using Macbeth, not a full official exam paper. In Act 1, Scene 7 Macbeth says:\n\n“I have no spur\nTo prick the sides of my intent, but only\nVaulting ambition, which o’erleaps itself\nAnd falls on th’ other—”\n\nStarting with this extract, explain how Shakespeare presents ambition as a danger in Macbeth. Analyse language in the extract and connect it to at least two relevant moments elsewhere in the play. Source: Folger Shakespeare Library, Macbeth 1.7.",
    "marks": 6,
    "markScheme": [
      "Develop a relevant argument about ambition.",
      "Use accurate evidence from the extract.",
      "Analyse the riding imagery and its implications.",
      "Connect the extract to Macbeth’s decision to kill Duncan.",
      "Connect it to a later moment such as arranging Banquo’s murder, explaining the relationship.",
      "Explain how the whole-play connections develop the argument rather than retelling events."
    ],
    "answer": "Shakespeare presents ambition as dangerous when it overrides Macbeth’s moral understanding. The riding image in “spur” makes motivation seem like a force driving action, but “no spur” shows that Macbeth recognises he lacks a just reason to kill Duncan. “Vaulting” suggests an attempt to rise too far, making the desired ascent carry the possibility of a fall.\n\nElsewhere in the scene Macbeth recognises his obligations as Duncan’s subject, relative and host, yet ultimately agrees to the murder after Lady Macbeth challenges him. His ambition therefore involves a choice against reasons he already understands. Later, arranging Banquo’s murder shows that gaining the crown does not satisfy him: protecting power produces further violence and insecurity. Across the play, the initial desire to rise becomes a destructive effort to maintain an increasingly unstable position.",
    "notation": false
  },
  "y11-english-unseen/exam-2-AQA-core": {
    "question": "Read the two original unseen teaching poems. Compare how they present time and memory through language and form.\n\nPoem 1\nEvening slips along the alleyway,\nstreetlamps cough pale gold light.\nThe clock in the café lingers, slow,\nand I count the quiet between each breath.\n\nPoem 2\nMoonlight pools on the harbour wall,\na gull repeats a single cry;\nI cradle the moment in my hands,\nand time slips away like rain from July.",
    "marks": 6,
    "markScheme": [
      "1 mark: identifies a relevant shared concern about time or memory.",
      "1 mark: supports a language point with an exact quotation from Poem 1.",
      "1 mark: explains its effect.",
      "1 mark: supports a language point with an exact quotation from Poem 2 and explains its effect.",
      "1 mark: makes a supported comparison of the poems.",
      "1 mark: comments accurately on form or punctuation and links it to meaning."
    ],
    "answer": "Both four-line poems make time feel elusive. In Poem 1, evening “slips”, but the clock “lingers, slow”; that contrast suggests a difference between passing time and the speaker's experience of it. The repeated attention to quiet and breath creates a reflective mood.\n\nPoem 2 makes the wish to preserve a moment explicit through “I cradle the moment in my hands”. The tender verb contrasts with time slipping away. Each poem is a single compact stanza with punctuated line endings. These pauses invite attention to brief sensory moments; their short form alone does not prove that they must be read rapidly.",
    "notation": false
  },
  "y11-english-unseen/exam-4-Edexcel-core": {
    "question": "Read this original teaching poem, Old Pier. Analyse how form and structure contribute to mood and meaning.\n\nI walk the length of the old pier, where gulls\ncircle like question marks above the tide.\nThe boards remember names beneath a lamp\nthat flickers, then leans into the salt air.\nSea spray writes on my sleeve, letters\nI cannot quite decipher; the wind repeats them.\nA rope knocks twice against the landing rail.\nI stop and listen. Nothing answers me.\n\nYet water keeps its own uneven clock,\ncounting the spaces underneath the boards.\nI wait. The light shifts slowly towards shore.\nThe names I came to find will not return.\nI turn beside the lamp and take the path,\nleaving the gulls to question what remains.",
    "marks": 6,
    "markScheme": [
      "1 mark: offers an interpretation that addresses the task.",
      "1 mark: selects a relevant exact quotation.",
      "1 mark: explains a language choice and its effect.",
      "1 mark: identifies a structural feature present in the displayed poem.",
      "1 mark: explains its effect on the interpretation.",
      "1 mark: develops or qualifies the interpretation using a second relevant detail."
    ],
    "answer": "The first stanza has eight lines and the second six. The opening records sounds and sights on the pier; “Yet” begins a turn towards waiting and the recognition that the remembered people will not return.\n\nEnjambment in “where gulls / circle” carries movement across the first two lines. The break after “letters” similarly delays “I cannot quite decipher”, reflecting difficulty in making meaning from the scene.\n\nThe internal full stops in “I stop and listen. Nothing” and “I wait. The light” interrupt the flow. These pauses make the silence and the speaker's expectation more noticeable.\n\nThe final image returns to the gulls as questioners. This echoes the opening “question marks”, framing the poem with uncertainty even though the speaker physically leaves.",
    "notation": false,
    "hint": "Use the displayed line breaks and punctuation, and support each interpretation with an exact quotation."
  },
  "y11-english-unseen/practice-6-AQA-core": {
    "question": "Read this original teaching poem, Window. Form an interpretation of how form and language present isolation and connection.\n\nRain taps the window, a patient drum.\nStreetlamps keep watch over the town.\nI count the minutes on the neon sign,\nthen turn the brightness down.\n\nA couple pass beneath one coat;\nI watch their shoulders meet\nand rest my hand against the glass.\nRain washes out the street.",
    "hint": "Use the displayed line breaks and punctuation, and support each interpretation with an exact quotation.",
    "working": [
      "The two four-line stanzas contrast the speaker's private waiting with the sight of a couple outside. “I count the minutes” suggests isolation and an awareness of passing time.",
      "The shared coat and meeting shoulders make the couple's connection physical. The sentence runs from “I watch their shoulders meet” into “and rest my hand”, connecting their closeness with the speaker's response.",
      "The hand touches glass rather than another person, so the window can suggest a barrier as well as a viewpoint. The final short sentence returns attention to rain, leaving the speaker's longing unresolved."
    ],
    "answer": "The two four-line stanzas contrast the speaker's private waiting with the sight of a couple outside. “I count the minutes” suggests isolation and an awareness of passing time.\n\nThe shared coat and meeting shoulders make the couple's connection physical. The sentence runs from “I watch their shoulders meet” into “and rest my hand”, connecting their closeness with the speaker's response.\n\nThe hand touches glass rather than another person, so the window can suggest a barrier as well as a viewpoint. The final short sentence returns attention to rain, leaving the speaker's longing unresolved.",
    "notation": false
  },
  "y11-english-unseen/practice-9-Edexcel-core": {
    "question": "Read this original teaching poem, Morning Cup. Interpret how line breaks, pauses and stanza structure present time and memory.\n\nMorning slips through blinds of bare white wood\nand rests beside the cup you used to choose.\nI listen to the clock. Its measured beat\ncounts out the things I have no wish to lose.\nThe teaspoon glints; I turn it in my hand\nand watch the light move slowly round the room.\n\nYour chair is empty. Still, I leave it there.\nThe kettle clicks; its steam begins to rise.\nI pour one cup and carry it outside\nto where the pale sun opens up the skies.\nThe clock grows faint behind the kitchen door.\nI let the morning offer something more.",
    "hint": "Use the displayed line breaks and punctuation, and support each interpretation with an exact quotation.",
    "working": [
      "Two six-line stanzas divide the indoor ritual from a movement outside. The balanced form gives the speaker's routine a sense of order, even though the unused cup and “empty” chair suggest loss.",
      "Enjambment in “Its measured beat / counts out” carries the clock's action into the next line. The full stop within “Your chair is empty. Still” creates a pause before the speaker insists on keeping the chair.",
      "The shift to “carry it outside” changes the setting, while the final more/door rhyme provides a degree of closure. “Offer something more” suggests cautious openness to the future; it does not prove that grief has ended."
    ],
    "answer": "Two six-line stanzas divide the indoor ritual from a movement outside. The balanced form gives the speaker's routine a sense of order, even though the unused cup and “empty” chair suggest loss.\n\nEnjambment in “Its measured beat / counts out” carries the clock's action into the next line. The full stop within “Your chair is empty. Still” creates a pause before the speaker insists on keeping the chair.\n\nThe shift to “carry it outside” changes the setting, while the final more/door rhyme provides a degree of closure. “Offer something more” suggests cautious openness to the future; it does not prove that grief has ended.",
    "notation": false
  },
  "y11-geography-case-studies-and-exam-skills/exam-9-Edexcel-core": {
    "question": "Give the name and location of one real coastal settlement where you have studied a coastal management scheme. This is a recall exercise: use your taught case study.",
    "marks": 1,
    "markScheme": [
      "Names a real coastal settlement and locates it correctly; accept any appropriate taught example."
    ],
    "answer": "For example, Lyme Regis in Dorset, on the south coast of England. Other correctly located taught examples are acceptable.",
    "notation": false
  },
  "y11-geography-decision-making-exercise/practice-0-Edexcel-core": {
    "question": "This is a fictional teaching scenario. 1 – Synthesise sources: You are the planning officer for the coastal town of Seabrook, facing flood risk from the River Wyre. Read Source A and Source B below and decide which flood defence option the council should fund to reduce flood risk. Source A describes a sea defence scheme called AquaWall: 'cost £9.5 million; will protect 85% of houses in the town; will create 3.0 hectares of public space but requires demolition of 7 small businesses and will cause traffic disruption during construction.' Source B describes a nature-based option: 'Natural flood management by restoring wetlands along the estuary; cost £5.2 million; will reduce flood risk to 60% of houses in the town; will create 1.2 hectares of wetlands and will protect 15 small businesses that would otherwise be affected by floods.' Using information from both sources, explain which option you would fund and why, considering social, economic and environmental factors.",
    "hint": "Focus on which option protects more of the town and consider social/economic/environmental impacts, not just cost.",
    "working": [
      "A is stated to protect 85% of houses and B 60%, but protection standards and residual risks need checking.",
      "A costs £9.5m and requires demolition of seven businesses; B costs £5.2m and protects 15 businesses.",
      "A creates 3 hectares of public space; B creates 1.2 hectares of wetlands. These benefits are different rather than directly interchangeable.",
      "State the chosen priority and acknowledge the other option’s advantages."
    ],
    "answer": "If the priority is the stated proportion of houses protected, I would provisionally choose A: 85% versus 60%. This comes with a higher initial cost (£9.5m versus £5.2m), demolition of seven businesses and construction disruption, so relocation and compensation would be major concerns. B preserves or protects 15 businesses and creates wetlands, offering social and habitat benefits at lower initial cost. A is therefore a conditional recommendation, not an unqualified best option; protection standards, maintenance costs and affected residents’ and businesses’ views could change the decision.",
    "notation": false
  },
  "y11-geography-decision-making-exercise/practice-5-AQA-core": {
    "question": "This is a fictional teaching scenario. In the coastal town of Seaview, the council must choose between two flood-defence options to protect homes, businesses and the local economy. Option A is a steel sea wall along 3.0 km of coastline, costing £12 million. It would reduce the number of flood days per year from 8 days to 1 day and would require maintenance costing £0.6 million per year. It would increase annual tourism revenue by 3% and would provide about 100 jobs during construction. Option B is a natural flood-management marsh restoration along 2.5 km of coastline, costing £6 million. It would reduce flood days per year from 8 days to 3 days and would require maintenance costing £0.2 million per year. It would increase annual tourism revenue by 6% and would provide about 60 jobs during construction and 10 ongoing maintenance roles. The council has a budget of £15 million available for flood-defence works this year. Justify which option you would recommend the council to fund, explaining why you think this option is the best choice given the information.",
    "hint": "Think about what matters most to Seaview—strong protection for homes and services, or benefits for the environment and eco-tourism.",
    "working": [
      "Both options fit the £15 million budget (Option A £12m; Option B £6m).",
      "Option A reduces flood days from 8 to 1 (a 7-day reduction); Option B reduces from 8 to 3 (a 5-day reduction).",
      "Option A provides 100 construction jobs and +3% tourism revenue; Option B provides 60 construction jobs and +10 ongoing maintenance roles plus +6% tourism revenue.",
      "Given the priority of protecting homes and essential services, the greater reduction in flood days with Option A offers stronger long-term flood protection, and the budget allows it, making it the best choice despite the smaller tourism gain."
    ],
    "answer": "I would provisionally recommend A if reducing flood days is the overriding priority: it reduces them from eight to one, compared with three for B. Both initial costs fit the £15 million budget, but A costs £12m initially and £0.6m each year in maintenance; B costs £6m and £0.2m each year. The current-year budget does not establish that A’s future maintenance is affordable. B also has the larger projected tourism increase (6% versus 3%) and ten ongoing maintenance roles, while A provides more construction jobs. A’s extra reduction in flood days must therefore be weighed against its continuing cost and B’s other benefits. Flood depth, properties affected and a future maintenance budget are needed for a firmer recommendation.",
    "notation": false
  },
  "y11-geography-decision-making-exercise/practice-9-AQA-core": {
    "question": "The council of fictional Riverside Town needs to decide which flood management measure to prioritise. Using Sources A, B and C below, synthesize information to decide which option the council should prioritise and justify your choice. In your answer, compare how effective each option is, how much it costs, and the likely social and practical implications. You should base your answer on the information in the three sources and show how you combine them to reach a clear decision. Sources: Source A: A reinforced sea wall would cost £2.3 million and would protect 90% of Riverside Town from floodwater reaching homes and shops. Source B: Restoring a natural floodplain on the eastern edge of the river would cost £1.1 million and would reduce peak river flows during floods by about 20%. Source C: A flood warning and response system, including sirens and community training, would cost £150,000 per year to run and could reduce damages by up to 15% if residents respond promptly.",
    "hint": "Compare costs on a common time horizon, but keep protection coverage, peak-flow reduction and damage reduction distinct.",
    "working": [
      "A costs £2.3 million upfront and claims protection for 90% of the town. B costs £1.1 million upfront and claims a 20% reduction in peak flow. C costs £150,000 annually and claims up to 15% damage reduction depending on residents responding.",
      "These percentages measure different outcomes and cannot be ranked by dividing cost by percentage points. Maintenance, scheme lifetime and comparable estimates of avoided damage are missing.",
      "A offers direct protection to most of the town according to the source, but leaves some areas unprotected. B may restore habitat and flood storage but needs land. C depends on timely warnings and residents being able to act.",
      "Make a conditional recommendation, weigh affected groups, and identify evidence needed before committing funds."
    ],
    "answer": "I would provisionally prioritise A if the stated 90% coverage is credible and the council can fund construction and maintenance, because it directly protects many homes and shops. However, the sources do not establish the best value: the percentages use different measures, and A and B lack operating costs and lifetimes. Assess who remains exposed, impacts on coastal processes and access, land needed for B, and whether vulnerable residents can act on C. Compare all three using the same time horizon and expected damage avoided before making a final decision. A different choice with sound source-based reasoning is acceptable.",
    "notation": false
  },
  "y11-geography-decision-making-exercise/practice-9-Edexcel-core": {
    "question": "This is a fictional planning exercise. All source summaries and figures below are invented teaching material, not quotations from real reports. Synthesise sources A–D to decide which option the Greenfield Town Council should adopt to reduce river flood risk in the River Willow catchment over the next five years. Use sources A–D and your own knowledge to justify your choice. The four options are: A) Build a concrete flood barrier along 3 km of the river at a cost of £18 million. B) Restore and connect 2 km of floodplain wetlands at a cost of £4.8 million. C) Improve urban drainage with new pipes and maintenance over 3 km of drainage network at a cost of £6.5 million. D) Implement a community-led package of green roofs, permeable pavements and rain gardens with an initial cost of £0.9 million and annual maintenance £0.2 million. Source A: Government report summary: \"Hard engineering reduces flood risk quickly but has high lifecycle costs and can disrupt local ecosystems.\" Source B: Local residents’ group: \"Wetlands store floodwater, create habitat, and can improve local well-being; cheaper in the long term.\" Source C: Environmental NGO: \"Green infrastructure can offer long-term savings but needs ongoing upkeep.\" Source D: Flood data: \"Average rainfall in this area has risen by around 12% in the last decade; more heavy rainfall events are expected.\"",
    "hint": "Consider long-term costs and the wider social and ecological benefits, not just how fast a barrier would work.",
    "working": [
      "Compare initial costs: A £18m, B £4.8m, C £6.5m, D £0.9m.",
      "D’s stated five-year cost is £1.9m including five annual £0.2m maintenance payments; maintenance for A–C is not quantified.",
      "B offers potential storage and habitat benefits, but the sources do not quantify flood-risk reduction for any option.",
      "Mean rainfall change alone does not establish flood frequency; the source separately projects more heavy rainfall.",
      "Choose provisionally using an explicit criterion and identify missing evidence."
    ],
    "answer": "I would investigate B if floodwater storage and connected habitat are the main priorities, using source B’s claimed benefits alongside A’s warning about ecological disruption. However, B is not the cheapest stated option: D totals £1.9m over five years, while B starts at £4.8m and has unspecified maintenance. Source C supports considering green infrastructure with upkeep, and D indicates a need to plan for heavier rainfall. None of the sources quantifies protection for the proposed schemes. I would therefore compare expected flood reduction, land availability, maintenance and benefits to residents before committing funds; the data do not establish a uniquely best option.",
    "notation": false
  },
  "y11-geography-human-fieldwork/practice-3-Edexcel-core": {
    "question": "You are designing a fieldwork activity to investigate how people use public parks at different entrances. You decide to collect observational data by counting the number of people who enter park entrances A, B and C during a 10-minute observation at each entrance on three separate mornings (Day 1, Day 2, Day 3). The data you collect are recorded as follows: Day 1 counts: Entrance A 40, Entrance B 35, Entrance C 45; Day 2 counts: Entrance A 42, Entrance B 36, Entrance C 48; Day 3 counts: Entrance A 39, Entrance B 38, Entrance C 46. Design a data collection plan that explains: what data you would collect (types of data), how you would collect it (timing and coding), a simple sampling approach (which entrances and days you would observe and why), and how you would check reliability of your data.",
    "hint": "Plan consistent counting periods and repeat observations; distinguish a ten-minute count from a whole-day total.",
    "working": [
      "Collect quantitative entrance counts, recording entrance, date, start time, duration and conditions.",
      "Use the same entry-only counting rule and synchronised ten-minute periods at A, B and C on three mornings.",
      "Use a systematic schedule and repeat across additional times and days to improve representativeness.",
      "Compare independent observers at a pilot session, use tally sheets and record disruptions."
    ],
    "answer": "Use a tally sheet to count entries at A, B and C during matched ten-minute periods on three mornings. Agree what counts as an entry and record the time, weather and unusual events. Use observers at all entrances simultaneously, or rotate the order if simultaneous counts are impossible and acknowledge the time difference. Repeat at other times and weekdays/weekends if conclusions are intended to cover general park use. Pilot with two observers counting the same entrance, compare totals and clarify counting rules. Record no names or identifiable images, avoid obstructing paths and follow the fieldwork risk assessment. The supplied counts total 369, averaging 41 entries per ten-minute observation; this is not 41 per whole day. Present entrance-by-day counts and discuss the limited sample.",
    "notation": false
  },
  "y11-geography-people-place-and-environment/exam-9-AQA-core": {
    "question": "In the fictional tropical coastal town of Seabrook, a sea wall was built along 3 km of coastline in 2005 to protect homes from storm surges. In 2010 mangroves were planted along the shoreline to reduce erosion, and in 2015 a new tourism zone opened near the harbour, increasing boat traffic and litter. Local fishermen report changing fish stocks and more frequent storms. Explain how these actions show interactions between people and the environment, identifying how people modify the environment and how the environment influences people.",
    "marks": 6,
    "markScheme": [
      "Construction of a sea wall shows how people modify the coast to reduce hazard.",
      "Mangrove planting illustrates a nature-based approach to protect land and habitats.",
      "Tourism development and increased boat traffic show environmental pressure from economic activity.",
      "Fishermen reporting changing fish stocks shows how environmental changes affect livelihoods.",
      "Coastal modifications can alter natural processes such as wave energy and sediment movement, potentially affecting areas beyond the built-up coast.",
      "Communities must plan and adapt to hazards and pressures, showing how the environment drives resilience and decision-making."
    ],
    "answer": "The sea wall protects homes from storms, but it alters coastal processes such as wave breaking and sediment transport. The mangroves planted in 2010 reduce erosion, trap sediment and provide habitat, representing a positive environmental modification. The 2015 tourism zone increases boat traffic and litter, putting pressure on the coast and marine life. Local fishermen report changing fish stocks, showing how environmental changes affect livelihoods and the economy. The changes to the coastline can shift erosion and wave energy to other parts of the coast, affecting areas beyond Seabrook. To cope, the community must plan and adapt through maintenance, pollution control, and sustainable tourism practices, reflecting how the environment shapes human decisions and resilience.",
    "notation": false
  },
  "y11-geography-physical-fieldwork/practice-7-AQA-core": {
    "question": "Question 8: In a river study for the Physical Fieldwork sub-topic Present field data, you recorded the depth (in cm) at five points along a transect: Point A 52.5 cm, Point B 50.0 cm, Point C 53.0 cm, Point D 48.5 cm, Point E 49.0 cm. Present the data clearly and answer: (a) calculate the mean depth; (b) determine the range; (c) identify deepest and shallowest points and by how many centimetres the deepest depth exceeds the shallowest.",
    "hint": "Remember to use all five measurements when calculating the mean, and compare the largest and smallest values when finding the range.",
    "working": [
      "Sum of depths = 52.5 cm + 50.0 cm + 53.0 cm + 48.5 cm + 49.0 cm = 253.0 cm",
      "Mean depth = 253.0 cm ÷ 5 = 50.6 cm",
      "Range = 53.0 cm − 48.5 cm = 4.5 cm",
      "Deepest = Point C with 53.0 cm; shallowest = Point D with 48.5 cm; deepest exceeds shallowest by 4.5 cm"
    ],
    "answer": "Mean depth = 50.6 cm; Range = 4.5 cm; Deepest Point: C (53.0 cm); Shallowest Point: D (48.5 cm); Deepest depth exceeds shallowest by 4.5 cm",
    "notation": false
  },
  "y11-geography-physical-fieldwork/practice-8-Edexcel-core": {
    "question": "Evaluate the reliability of the soil temperature data collected along a 10 m transect using a handheld thermometer with an accuracy of ±0.5°C. Readings (°C) were: 14.5, 15.0, 14.8, 14.6, 15.2, 14.7, 14.9, 15.1, 14.5, 14.8.",
    "hint": "Different positions may have different temperatures; repeat measurements at the same positions to assess repeatability.",
    "working": [
      "The minimum is 14.5 °C and maximum is 15.2 °C, giving a range of 0.7 °C.",
      "Accuracy ±0.5 °C is a bound around each reading, not a range of repeated readings. The intervals for the extreme readings overlap.",
      "Because readings were taken at different positions, variation may reflect actual spatial differences as well as measurement effects. These data alone do not establish repeatability.",
      "Repeat at each marked position using consistent depth, timing and stabilisation; check the thermometer against a reference and record conditions."
    ],
    "answer": "The 0.7 °C spatial range does not prove reliable or unreliable measurement. With stated ±0.5 °C accuracy, the extreme readings have overlapping uncertainty intervals, so the small observed difference may not be resolved confidently. Repeat measurements at each position with consistent technique, allow the sensor to stabilise and check calibration. Average repeated readings at each position where appropriate; averaging all positions would hide the spatial pattern and would not remove a systematic bias.",
    "notation": false
  },
  "y11-history-chronology-and-connections/practice-6-Edexcel-core": {
    "question": "Build a retrieval timeline of the following events related to the origins of the Cold War. Use the dates provided to place each event in chronological order from earliest to latest. For each event write a short retrieval clue (one phrase) that would help you remember when it happened. Yalta Conference – February 1945; Potsdam Conference – July–August 1945; Iron Curtain speech – March 1946; Truman Doctrine – March 1947; Marshall Plan announced – June 1947; Berlin Blockade – June 1948; NATO formed – April 1949; Korean War begins – June 1950; Death of Stalin – March 1953.",
    "hint": "Think about how the sequence moves from wartime talks to policy decisions and alliances.",
    "working": [
      "Step 1: List all events with their dates and order them by year: 1945 (Yalta 2/1945; Potsdam 7–8/1945), 1946 (Iron Curtain 3/1946), 1947 (Truman Doctrine 3/1947; Marshall Plan 6/1947), 1948 (Berlin Blockade 6/1948), 1949 (NATO formed 4/1949), 1950 (Korean War begins 6/1950), 1953 (Death of Stalin 3/1953).",
      "Step 2: Within 1945, place Yalta before Potsdam because February comes earlier in the year than July–August.",
      "Step 3: Within 1947, place Truman Doctrine before Marshall Plan (March before June).",
      "Step 4: Position Berlin Blockade after 1947 events and before NATO in 1949, since 1948 comes before 1949.",
      "Step 5: Compile the final, chronological timeline in order: Yalta Conference (February 1945); Potsdam Conference (July–August 1945); Iron Curtain speech (March 1946); Truman Doctrine (March 1947); Marshall Plan (June 1947); Berlin Blockade (June 1948); NATO formed (April 1949); Korean War begins (June 1950); Death of Stalin (March 1953)."
    ],
    "answer": "February 1945 — Yalta: wartime allies plan the peace. July–August 1945 — Potsdam: Germany defeated, settlement tensions. March 1946 — Iron Curtain speech: Churchill describes European division. March 1947 — Truman Doctrine: US support against communist expansion. June 1947 — Marshall Plan announced: European recovery aid proposed. June 1948 — Berlin Blockade begins: Soviet restrictions on Western surface access. April 1949 — NATO formed: Western collective-defence alliance. June 1950 — Korean War begins: North invades South. March 1953 — Stalin dies: Soviet leadership changes.",
    "notation": false
  },
  "y11-history-conflict-and-tension/exam-0-AQA-core": {
    "question": "The following six developments affected international relations between 1919 and 1938. Put these developments in chronological order and explain how each affected cooperation or tension: 1919 Treaty of Versailles; 1925 Locarno Treaties; 1931 Japan invades Manchuria; 1935 Hitler announces rearmament and signs the Anglo-German Naval Pact; 1936 Remilitarisation of the Rhineland; 1938 Munich Agreement.",
    "marks": 6,
    "markScheme": [
      "Versailles (1919) identified as the first development in the sequence; explains that harsh terms on Germany created resentment and a desire to revise the post-war settlement.",
      "Locarno Treaties (1925) identified as the second development; explains they aimed to secure borders and reduce immediate threats but did not remove German revisionist aims or the potential for conflict.",
      "Manchuria (1931) identified as the third development; explains it showed the League of Nations’ weakness and encouraged further aggression by aggressor states.",
      "1935 rearmament and the Anglo-German Naval Pact (1935) identified as the fourth development; explains it signalled Germany’s rearmament and shifted the balance of power, undermining collective opposition and alarming France.",
      "Rhineland remilitarisation (1936) identified as the fifth development; explains it violated Versailles and Locarno terms and demonstrated a willingness to challenge the post-war settlement.",
      "Munich Agreement (1938) identified as the sixth development; explains it appeased Hitler but emboldened him and increased distrust of Britain and France."
    ],
    "answer": "1919 Treaty of Versailles — It imposed harsh terms on Germany (reparations, loss of territory, military restrictions), which fuelled German resentment and revisionist aims, heightening future tensions. 1925 Locarno Treaties — They aimed to secure borders and reduce immediate threat, giving a sense of temporary stability but failing to resolve underlying German grievances or prevent future aggression. 1931 Japan invades Manchuria — Demonstrated aggression outside Europe and exposed the weakness of the League of Nations, encouraging further expansion by revisionist powers. 1935 Hitler announces rearmament and signs the Anglo-German Naval Pact — Marked a clear step in German rearmament and a shift in power balance, formalising British acceptance of limited German naval expansion while undermining collective opposition and alarming France. 1936 Remilitarisation of the Rhineland — Germany violated Versailles and Locarno terms, showing that the regime would actively break the post-war settlement and embolden further bold moves. 1938 Munich Agreement — Appeasement failed to stop Hitler’s aims and encouraged further aggression, eroding allied confidence and increasing fear of another large-scale war.",
    "notation": false
  },
  "y11-history-conflict-and-tension/exam-8-AQA-core": {
    "question": "Assess the significance of (i) resentment of the Treaty of Versailles and (ii) appeasement in contributing to war in Europe in 1939. Relevant developments include German annexation of Austria in March 1938, the Munich Agreement concerning the Sudetenland in September 1938, German occupation of the Czech lands in March 1939 and the invasion of Poland in September 1939. Explain how the factors interacted, give a criterion for significance and justify your judgement. These two factors do not form a complete explanation of the war.",
    "marks": 6,
    "markScheme": [
      "1 mark: explains a relevant effect of Versailles, such as resentment of territorial or military restrictions.",
      "1 mark: links that resentment to revisionist politics without claiming it made war inevitable.",
      "1 mark: explains appeasement and accurately distinguishes Anschluss from the Munich settlement.",
      "1 mark: explains how later German actions exposed the limits of concessions.",
      "1 mark: compares the factors using a criterion such as long-term influence or immediate effect.",
      "1 mark: gives a supported judgement; accepts either factor if justified and recognises other causes."
    ],
    "answer": "Using immediate effect as my criterion, appeasement was especially significant because concessions and limited resistance helped Hitler test how far he could expand. Anschluss in March 1938 preceded Munich; Munich later conceded the Sudetenland, not Austria. Occupation of the Czech lands in March 1939 exposed the limits of claims about self-determination.\n\nVersailles mattered as a longer-term source of resentment that Nazi propaganda exploited. It did not make war inevitable: later economic crises, Nazi ideology and deliberate decisions also mattered. I would therefore prioritise appeasement for its immediate role while treating Versailles as an important background factor. A different ranking could be justified using a longer-term criterion.",
    "notation": false
  },
  "y11-history-conflict-and-tension/exam-9-Edexcel-core": {
    "question": "The following brief passage describes the aims of the three main powers in 1919. Read it and then answer. Britain: aims to protect sea lanes and the empire, to maintain economic access, and to balance punishment of Germany with stability in Europe; to pursue a settlement that allows Britain to recover after war but avoids a confrontation that could destabilise Europe. France: aims to secure its borders, especially against future German aggression; to reduce Germany's power by demanding heavy reparations and to ensure security by strengthening borders and keeping Germany weak. USA: aims to promote democracy and self-determination; to create a fair peace based on open diplomacy and the League of Nations; to secure economic recovery through free trade. Using this information, analyse the aims of the main powers and explain how these aims would shape the terms of the peace settlement at the Paris Peace Conference in 1919.",
    "marks": 6,
    "markScheme": [
      "Britain aims: protect sea lanes and empire, and maintain economic access.",
      "Britain aims: balance punishment of Germany with Europe-wide stability to support recovery.",
      "France aims: secure borders and weaken Germany through heavy reparations.",
      "France aims: ensure security by keeping Germany weak and the Rhineland demilitarised.",
      "USA aims: promote democracy and self-determination; create a League of Nations.",
      "USA aims: support economic recovery through free trade and open diplomacy."
    ],
    "answer": "Britain’s aims in the passage are twofold. First, Britain wants to protect its sea lanes and its empire, and to keep economic access to markets and resources. Second, it seeks to balance punishment of Germany with stability in Europe, aiming for a settlement that helps Britain recover after the war without provoking further conflict. Together these aims push Britain toward a peace that is firm but not ruinous, preserving trade routes and imperial interests while avoiding a collapse of European stability that could threaten Britain’s recovery. France’s aims focus on security and punishment. It wants to secure its borders against future German aggression and to weaken Germany to prevent any recurrence of threat. It seeks heavy reparations and measures that keep Germany militarily weak, including security arrangements that protect France—for example, limiting German military power and defending borders to deter future attacks. These aims would push terms toward harsh reparations, territorial safeguards, and strict demilitarisation to guarantee France’s security. The United States’ aims are liberal and internationalist. It wants democracy and self-determination for peoples, a fair peace based on open diplomacy, and the creation of a League of Nations to provide collective security. It also seeks economic recovery through free trade and openness. These aims would steer the peace toward a rules-based order, with formal international institutions and mechanisms for cooperation, even if that meant compromises on punitive measures. How these aims would shape the peace terms: Britain’s insistence on stability and economic access would temper extreme punishment and push for terms that allow economic recovery and continued trade. France’s insistence on security and punishing Germany would advocate strong reparations, demilitarisation, and security guarantees that would curb German power. The American aim for self-determination and a League of Nations would embed the peace in a framework of international cooperation and rules-based diplomacy. In combination, the final settlement would likely feature significant punitive elements against Germany to satisfy France, while incorporating institutionalised cooperation (the League) and compromises influenced by competing British, French and American priorities. One defensible judgement, if military restrictions are the criterion, prioritises France’s security-focused aim to weaken Germany and secure its borders, because this helps explain the punitive measures and militarily restrictive provisions. Britain’s desire for a stable, trade-friendly peace moderates those terms, and the American aim for a League of Nations shapes the political framework of the post-war order, even if it does not determine the punitive content as strongly.",
    "notation": false
  },
  "y11-history-interpretation-and-essay-mastery/exam-1-AQA-core": {
    "question": "Evaluate how far the expansion of elementary education in England and Wales between 1870 and 1891 improved access to schooling. Use these two modern teaching summaries, which are not primary-source quotations, and your own knowledge. A: The 1870 Act allowed school boards to provide schools where provision was insufficient; the 1880 Act made attendance compulsory for children aged five to ten, and the 1891 fee grant widened access to free elementary education. B: More school places and reduced fees removed barriers, but poverty, children’s work and difficulties enforcing attendance still affected families. Compare what the summaries explain and what further evidence would be needed to judge equality of opportunity.",
    "marks": 6,
    "markScheme": [
      "Accurately explains the 1870 expansion of school provision.",
      "Distinguishes compulsory attendance in 1880 from the 1870 Act.",
      "Explains how the 1891 fee grant reduced financial barriers.",
      "Uses Summary B to explain a continuing barrier such as poverty or children’s work.",
      "Recognises that teaching summaries are interpretations, not direct primary evidence or proof of universal outcomes.",
      "Reaches a supported judgement and identifies relevant further evidence."
    ],
    "answer": "Access improved through additional provision after 1870, compulsory attendance for ages five to ten in 1880, and the 1891 fee grant that widened free elementary education. These were different reforms, not benefits created all at once by a 1907 Act. Summary A explains institutional changes; Summary B identifies reasons why legal provision did not ensure equal attendance or opportunity. Poverty and the need for children’s earnings could still create obstacles. Both texts are modern teaching summaries, so their claims should be checked against legislation, school attendance records and evidence from families across different places. Overall, barriers were reduced, but the summaries alone cannot establish universal equality of opportunity.",
    "notation": false
  },
  "y11-history-interpretation-and-essay-mastery/exam-9-AQA-core": {
    "question": "This is a fictional teaching exercise. The event, interpretation, diary quotation and publication details below are invented; analyse how the text constructs an argument, not whether they establish a real historical event. Read the extract about an imagined Brookside riot set in 1905. Interpretations are written to persuade a reader about why events happened. The extract below is from Interpretation B, titled “The Brookside Riot of 1905 and its Aftermath”. The author writes: “When the factory whistle blew and a crowd gathered, the town's mood shifted from frustration to anger.” The author continues: “Officials responded with a heavy hand, arresting demonstrators and banning gatherings, a sequence that turned a local disturbance into a symbol of rebellion.” The author cites a diary entry from a local worker: “We had no food, no work, and no hope; the guards were cruel and unyielding.” The author adds: “Because we were told stories of brave rebels who refused to back down, we see the riot as a heroic stand.” The interpretation, published as a school resource in 2020, aims to present the riot as a turning point in local history and to encourage students to empathise with the poor. However, it uses selective evidence: it quotes a diary that is clearly subjective, omits the perspective of town officials, and frames the riot as inevitable rather than contingent. Analyse how the interpretation constructs its view of the Brookside riot, with reference to evidence, language and structure in the extract.",
    "marks": 6,
    "markScheme": [
      "Identifies the purpose and intended audience of the interpretation.",
      "Explains how selective evidence (diary quotation, focused sources) shapes the interpretation of causes.",
      "Describes how language and tone (emotive words like “cruel,” “heavy hand,” “heroic”) influence readers’ views of actors.",
      "Explains how the structure (opening claim, supporting evidence, concluding judgement) guides interpretation.",
      "Notes contextual framing (published as a school resource in 2020) and how it affects perceived credibility or purpose.",
      "Recognises bias or omission (excludes officials’ perspectives, presents a singular narrative) and its effect on interpretation."
    ],
    "answer": "The interpretation constructs its view by presenting a concise, strongly opinionated account that aims to evoke sympathy for the protesters and to cast the riot as a significant turning point. First, the opening claim sets up a causal narrative: a mood shift from frustration to anger follows the factory whistle, implying a direct link between material hardship and collective action. This is reinforced by the diary quote, which foregrounds deprivation and fear (“We had no food, no work, and no hope; the guards were cruel and unyielding”) and by the author’s description of officials responding with a “heavy hand,” suggesting repression as a catalyst for rebellion rather than considering other possible triggers. The use of terms like “symbol of rebellion” and “brave rebels” frames the protagonists positively and guides readers to view their actions as justified and heroic. Second, the extract relies on selective sources: a single diarist’s voice is cited to personify the experience, while official or other perspectives are omitted, shaping causation as a moral, unified story rather than a balanced account. Third, the language is emotive and evaluative, not neutral: adjectives such as “cruel,” “heavy,” and “heroic” steer readers toward a particular interpretation. Finally, the publication of the piece as a school resource in 2020 and its clear aim to foster empathy suggest an instructional purpose, which may limit critical engagement with alternative explanations. In sum, the interpretation constructs its view by prioritising emotive language, a narrow evidence base, and a structured progression that leads readers to a predetermined conclusion while downplaying other perspectives. Because the material is fictional, this analysis demonstrates interpretation skills rather than authenticating a historical riot.",
    "notation": false
  },
  "y11-history-patterns-of-change/practice-7-AQA-core": {
    "question": "Question 8 (Evaluate turning points) Within Patterns of Change in Britain, turning points in the women's suffrage movement include the formation of the Women's Social and Political Union (WSPU) in 1903, the Representation of the People Act 1918, and the Equal Franchise Act 1928. Evaluate which turning points had the greatest impact on progress towards votes for women and explain why.",
    "hint": "Think about whether widening the franchise or changing campaigning methods had the bigger impact.",
    "working": [
      "Step 1: Define a turning point and identify the turning points named in the question.",
      "Step 2: Explain how the 1903 formation of the WSPU changed campaigning and public attitudes.",
      "Step 3: Explain how the 1918 Act expanded the electorate and what that meant for women’s political influence.",
      "Step 4: Explain how the 1928 Act granted equal voting rights to women aged 21 and over on the same terms as men and why that matters for equality.",
      "Step 5: Decide which turning point had the greatest impact and justify."
    ],
    "answer": "The 1928 Equal Franchise Act had the greatest impact because it granted equal voting rights to women aged 21 and over on the same terms as men, removing age and property restrictions and delivering true parity in the franchise; the 1918 Act was crucial and widened participation but remained partial, while the 1903 WSPU shifted campaigning and public debate but did not itself enfranchise women.",
    "notation": false
  },
  "y11-history-power-and-society/practice-8-AQA-core": {
    "question": "Sustain an analytical judgement: To what extent did Britain's parliamentary reforms of 1832, 1867 and 1884 shift political power from the elites to the electorate, compared with the growth of mass political participation after the 1918 and 1928 franchise reforms? Use the two original teaching interpretations below, to support your answer. Interpretation A argues that extending the franchise and redistributing seats made representation fairer and moved power away from the old unrepresentative system to the people. Interpretation B states that although reforms widened who could vote, real political power remained with the political class and the party machines, so the shift in power was limited; mass participation after 1918 increased participation but did not erase elite control.",
    "hint": "Think about what counts as power in politics: influence over decisions versus simply having the vote.",
    "working": [
      "Step 1: Interpretation A claims reforms redistributed power from elites to a broader electorate.",
      "Step 2: Interpretation B argues that reforms changed who could vote but did not substantially alter who actually controlled decisions.",
      "Step 3: The 1918 onwards changes increased mass participation, changing access to the political process but not necessarily who held power.",
      "Step 4: Therefore, the shift in power is partial: formal changes widened participation but real power remained largely with elites and party structures."
    ],
    "answer": "The parliamentary reforms of 1832–1884 opened representation and reduced the influence of unrepresentative elites, thus shifting some power to a broader electorate. However, Interpretation B’s view that power stayed with the political class and party machines means the shift was limited. The later growth in mass participation after 1918 increased people’s involvement, but it did not fundamentally overturn elite control. So, power did move to some extent, but not decisively; the change was partial rather than complete.",
    "notation": false
  },
  "y11-history-source-enquiry-mastery/exam-4-AQA-core": {
    "question": "Use the following fictional teaching stimuli and your knowledge of Britain in the First World War to assess whether these texts could demonstrate a change in public attitudes to recruitment between 1914 and 1916. A: an imagined voluntary-recruitment poster set in 1914, showing a soldier pointing and the slogan “Enlist and serve your country.” B: an imagined factory worker’s letter set in 1916: “Compulsory service worries me because my family relies on me, although I understand the need for more soldiers.” Discuss purpose, representativeness and the context of conscription. These are not quotations from authenticated historical documents.",
    "marks": 6,
    "markScheme": [
      "A is a persuasive recruitment message, not a survey of opinion.",
      "B expresses one imagined individual’s mixed feelings and cannot represent everyone.",
      "Introduces accurate context: voluntary recruitment preceded the introduction of conscription in Great Britain in 1916.",
      "Distinguishes a change in recruitment policy from a demonstrated change in public attitudes.",
      "Identifies need for varied authentic evidence and corroboration.",
      "Reaches a qualified judgement recognising that fictional stimuli cannot prove historical attitudes."
    ],
    "answer": "A models patriotic persuasion under voluntary recruitment; its message would not establish how many people agreed. B models concern about family alongside acceptance of military need, but one person would not represent the public. Conscription was introduced in Great Britain in 1916, showing a policy change rather than proving that public attitudes changed in the same way. Authentic letters from varied groups, newspapers, recruitment records and evidence of opposition would help assess change. These fictional stimuli are useful for practising source evaluation, but cannot themselves prove historical public opinion.",
    "notation": false
  },
  "y11-history-source-enquiry-mastery/exam-5-AQA-core": {
    "question": "Practise structuring a source response using two fictional teaching texts set in Britain in 1943. Neither is an authenticated quotation. A, an imagined government publicity text: “Women are taking on essential factory jobs and supporting the war effort. Their work deserves recognition.” B, an imagined factory worker’s letter: “The wages and new tasks give me more independence, but long shifts are exhausting and the housework still waits when I get home.” Assess how these texts illustrate both change and continuity in gender roles. Use an introduction, analysis of each text, comparison and conclusion, and identify evidence needed to establish real historical experience.",
    "marks": 6,
    "markScheme": [
      "Introduces change and continuity as the focus.",
      "Explains how A presents women’s industrial contribution positively.",
      "Explains B’s greater independence and new work.",
      "Explains B’s continuing domestic responsibilities and long hours.",
      "Compares publicity purpose with personal perspective without assuming either proves general experience.",
      "Concludes with a qualified judgement and need for authentic corroborating evidence."
    ],
    "answer": "The texts illustrate change in paid work alongside continuity in domestic expectations. A praises women’s essential factory work, emphasising public contribution in a publicity style. B presents new skills and wages as a source of independence, but also describes exhaustion and housework continuing after a shift. A foregrounds national contribution; B complicates that view with personal costs. The contrast suggests that a change in employment need not remove unequal domestic expectations. Because both texts are fictional, they demonstrate how to structure an interpretation rather than prove what women generally experienced. Authentic employment and pay records, varied personal accounts and evidence after the war would be needed to judge scale and lasting change.",
    "notation": false
  },
  "y11-history-source-enquiry-mastery/practice-9-AQA-core": {
    "question": "Timed provenance exercise: the following descriptions are fictional teaching scenarios, not authenticated primary sources. A is a private letter set in 1916 from a British soldier at the front to his family, describing his trench conditions. B is a British government recruitment leaflet set in 1916 and aimed at civilians at home. Assess how the stated author, purpose and audience would affect the usefulness of each for studying the British home front. Explain why provenance descriptions alone cannot establish which source is more reliable overall. Allow 20 minutes.",
    "hint": "Match the evidence to the enquiry: front-line experience and home-front messaging answer different questions.",
    "working": [
      "A could reveal a soldier’s experiences and communication with home, but he might withhold distressing details and does not directly observe civilian life.",
      "B could reveal official messages aimed at civilians, but persuasive claims do not measure actual public opinion or conditions.",
      "The full content and corroborating records are needed before judging accuracy and representativeness.",
      "Neither source is automatically reliable or unreliable because of its type; usefulness depends on the question."
    ],
    "answer": "On the stated provenance, B is more directly relevant to official home-front messaging, while A is more direct evidence of one soldier’s experience at the front. A may reveal what a family was told, but cannot stand for civilian conditions. B’s persuasive purpose is itself useful evidence, even where its claims need checking. We need the complete sources and corroboration before comparing reliability; these fictional descriptions cannot establish a universally more trustworthy source.",
    "notation": false
  },
  "y11-history-source-enquiry-mastery/practice-9-Edexcel-core": {
    "question": "Source A is a fictional teaching statement in the style of a British diplomat speaking in 1951: “We must work with our allies to prevent a return to isolation; international cooperation offers a route to peace and prosperity.”\n\nExam-style prompt: Explain two ways Source A is useful for studying one official argument for international cooperation. Assess how far Source A alone can represent the opinions of ordinary British people in the early 1950s.\n\nYour task is to identify these two demands precisely, not answer them.",
    "hint": "Look for the verbs that tell you what to do and copy them into your answer.",
    "working": [
      "The first command is Explain, directed at two uses for studying an official argument.",
      "The second is Assess how far, directed at representativeness of ordinary people's opinions.",
      "Keep usefulness for one argument separate from representativeness of a wider population."
    ],
    "answer": "1. Explain two ways the statement could help study an official argument for international cooperation.\n2. Assess the limits of using that statement alone to represent ordinary British people's opinions in the early 1950s.",
    "notation": false
  },
  "y11-maths-algebra/exam-8-Edexcel-Higher": {
    "question": "Use fixed-point iteration to approximate the positive solution of the equation $x = \\sqrt{2x + 3}$ to 2 decimal places. Start with $x_0 = 2$ and define the iteration $x_{n+1} = \\sqrt{2x_n + 3}$. Stop when $|x_{n+1} - x_n| < 0.01$. Show the sequence of iterates up to and including the iteration where the stopping criterion is met, and give the answer to 2 decimal places.",
    "marks": 4,
    "markScheme": [
      "Uses the given recurrence from x0 = 2.",
      "Computes the sequence: x0 = 2.000000, x1 = 2.645751, x2 = 2.879497, x3 = 2.959560, x4 = 2.986489, x5 = 2.995493.",
      "First difference below 0.01 occurs from x4 to x5; calculations retain unrounded values.",
      "Reports 3.00 to two decimal places."
    ],
    "answer": "x0 ≈ 2.000000; x1 ≈ 2.645751; x2 ≈ 2.879497; x3 ≈ 2.959560; x4 ≈ 2.986489; x5 ≈ 2.995493. The last difference is approximately 0.009004, the first below 0.01. The result to two decimal places is 3.00.",
    "notation": true
  },
  "y11-maths-circle/practice-2-AQA-Higher": {
    "question": "In a circle, four points $A, B, C, D$ lie on the circumference in that order around the circle. Prove that $\\angle ABC + \\angle ADC = 180^\\circ$.",
    "hint": "The two angles subtend the chord $AC$ but on opposite sides of $AC$; use the Inscribed Angle Theorem and the fact that the two arcs $AC$ on the circle together make a full circle.",
    "working": [
      "Angle ABC subtends arc ADC, the arc from A to C that does not contain B.",
      "Angle ADC subtends arc ABC, the arc from A to C that does not contain D.",
      "By the angle-at-the-centre theorem, each angle at the circumference is half the measure of its corresponding arc.",
      "The two arcs together make 360°, so angle ABC + angle ADC = ½ × 360° = 180°."
    ],
    "answer": "Opposite angles of this cyclic quadrilateral sum to 180°, because they subtend complementary arcs whose measures total 360°.",
    "notation": true
  },
  "y11-maths-found-algebra/exam-9-AQA-Foundation": {
    "question": "(a) Expand and simplify $6(2x+4) - 3x$. (b) Separately, factorise $9x+12$ completely.",
    "marks": 4,
    "markScheme": [
      "1 mark: expands $6(2x+4)$ to $12x+24$.",
      "1 mark: simplifies $12x+24-3x$ to $9x+24$.",
      "1 mark: identifies 3 as the highest common factor of $9x$ and 12.",
      "1 mark: writes $3(3x+4)$."
    ],
    "answer": "Expansion: $9x+24$ Factorised form: $3(3x+4)$",
    "notation": true
  },
  "y11-maths-found-statistics/practice-8-Edexcel-Foundation": {
    "question": "Interpret the scatter data described below, where the x-coordinate represents hours spent on homework (in hours) and the y-coordinate represents the maths test score (in percentage). The eight data pairs are: $(2, 45)$, $(3, 50)$, $(4, 60)$, $(5, 65)$, $(6, 70)$, $(7, 75)$, $(8, 78)$, $(9, 82)$. Describe the overall pattern shown by these data and judge whether the relationship is positive or negative and whether it is strong or weak. Then estimate the test score when hours spent is $7.5$ hours.",
    "hint": "Look for a pattern where the score tends to increase as hours increase.",
    "working": [
      "Step 1: There is a positive relationship because as $x$ increases, $y$ tends to increase.",
      "Step 2: Between $x=7$ and $x=8$, $y$ rises from $75$ to $78$, so the approximate slope is $\\frac{78-75}{8-7}=3$ per hour; for $x=7.5$, $y \\approx 75 + (7.5-7) \\times 3 = 75 + 0.5 \\times 3 = 76.5$.",
      "Step 3: Therefore, the estimated score at $x=7.5$ hours is $76.5$.",
      "The points lie close to a rising trend, so the association is strong and positive. Correlation alone does not prove that homework time causes higher scores."
    ],
    "answer": "There is a strong positive correlation: scores generally rise as homework time increases, and the points lie close to a rising trend. Linear interpolation between the two neighbouring values gives an estimated score of 76.5% at 7.5 hours. This is an estimate, not a guaranteed result.",
    "notation": true
  },
  "y11-maths-foundation/exam-9-AQA-Foundation": {
    "question": "Plan a multi-step solution. A school is decorating a hall for a charity event. They will hang a rectangular fabric banner on a wall. The banner measures $240.0$ cm long and $150.0$ cm wide. Backing fabric costs £4.75 per square metre, and they need $10\\%$ extra area for hemming. A frame runs along the outside edge and costs £2.50 per metre. If the school has £70.00, plan a multi-step solution to determine how much money will be left or how much more money is needed. Show your reasoning with the steps and numerical calculations.",
    "marks": 6,
    "markScheme": [
      "Convert the banner dimensions to metres and compute the area: $L = 2.40$ m, $W = 1.50$ m, $A = L \\times W = 2.40 \\times 1.50 = 3.60\\ \\mathrm{m^2}$.",
      "Include 10% extra area for hemming: $A_{\\text{tot}} = 1.10 \\times 3.60 = 3.96\\ \\mathrm{m^2}$.",
      "Cost of backing fabric: $C_{\\text{fabric}} = A_{\\text{tot}} \\times 4.75 = 3.96 \\times 4.75 = £18.81$.",
      "Finds perimeter 7.80 m and frame cost £19.50.",
      "Adds fabric and frame costs to obtain £38.31.",
      "Subtracts £38.31 from £70 to obtain £31.69 remaining."
    ],
    "answer": "Convert to metres: 2.40 × 1.50 gives 3.60 m². Allow 10% extra: 3.96 m², costing 3.96 × £4.75 = £18.81. The frame length is 2(2.40 + 1.50) = 7.80 m, costing £19.50. Total cost is £38.31, leaving £70 − £38.31 = £31.69.",
    "notation": true
  },
  "y11-maths-nonright/practice-7-Edexcel-Higher": {
    "question": "In triangle ABC, AB = 9 cm, AC = 7 cm, and ∠BAC = 40°. Use the triangle area formula $A = \\tfrac{1}{2} ab \\sin C$, where a and b are the sides enclosing angle C, to find the area of triangle ABC. Give your answer to 1 decimal place in cm^2.",
    "hint": "Use the two sides that surround the given angle in the area formula.",
    "working": [
      "The given angle is between AB = 9 cm and AC = 7 cm.",
      "Area = ½ × AB × AC × sin(angle BAC).",
      "Area = ½ × 9 × 7 × sin 40° = 31.5 × sin 40°.",
      "Using the unrounded sine gives approximately 20.2478097 cm².",
      "To one decimal place the area is 20.2 cm²."
    ],
    "answer": "20.2 cm²",
    "notation": true
  },
  "y11-maths-probability/exam-8-Edexcel-Higher": {
    "question": "In a standard deck of $52$ playing cards, there are $26$ red cards and $4$ aces. A card is drawn at random and not replaced. Given that the first card drawn is red, calculate the probability that the second card drawn is an ace.",
    "marks": 4,
    "markScheme": [
      "Given the first card is red, it is an ace with probability 2/26 = 1/13.",
      "If the first card is a red ace, the second is an ace with probability 3/51; otherwise it is 4/51.",
      "Combines branches: (1/13)(3/51) + (12/13)(4/51).",
      "Obtains 51/663 = 1/13, approximately 0.0769."
    ],
    "answer": "Given a red first card, it is an ace with probability 1/13 and not an ace with probability 12/13. Therefore the required probability is (1/13)(3/51) + (12/13)(4/51) = 51/663 = 1/13 ≈ 0.0769. The fraction 17/221 is equivalent to 1/13.",
    "notation": true
  },
  "y11-maths-proportion/exam-7-Edexcel-Higher": {
    "question": "A water tank holds $900$ litres. Tap A fills at $9$ litres per minute and Tap B fills at $6$ litres per minute. Treat (a), (b) and (c) as separate scenarios with constant flow rates. (a) Both taps are opened together from empty. How long does it take to fill the tank? (b) If only Tap A is on for the whole filling, how long would it take? (c) In a third scenario, Tap A runs alone until the tank is half full, then Tap B is also opened. How many more minutes are needed to fill the tank now? (d) Briefly explain, using this example, how the time to fill relates to the rate of filling.",
    "marks": 4,
    "markScheme": [
      "$t = \\frac{900}{9+6} = 60$ minutes.",
      "$t = \\frac{900}{9} = 100$ minutes.",
      "Remaining volume $450$ L; $t = \\frac{450}{9+6} = 30$ minutes.",
      "Time to fill is inversely proportional to the filling rate; as rate increases, time decreases, i.e. $t \\propto \\frac{1}{R}$."
    ],
    "answer": "(a) 60 minutes; (b) 100 minutes; (c) 30 minutes; (d) The time to fill decreases as the filling rate increases; the time is inversely proportional to the rate (t ∝ 1/R).",
    "notation": true
  },
  "y11-maths-statistics/exam-1-AQA-Higher": {
    "question": "Question 2 (Interpret cumulative frequency) The cumulative frequency data for the lengths of 40 pencils (in cm) are given below as 'up to' values: up to $4$ cm: $6$; up to $8$ cm: $12$; up to $12$ cm: $20$; up to $16$ cm: $28$; up to $20$ cm: $33$; up to $24$ cm: $36$; up to $28$ cm: $38$; up to $32$ cm: $40$. a) How many pencils are at most $20$ cm long? b) Using linear interpolation, estimate the length corresponding to cumulative frequency 25. c) Using cumulative frequency 20, estimate the median length of the pencils? d) Estimate the number of pencils with length between $9$ cm and $17$ cm, to the nearest whole pencil, using linear interpolation. e) What percentage of pencils are longer than $24$ cm? f) What is the total number of pencils in the sample?",
    "marks": 6,
    "markScheme": [
      "a) 33 pencils.",
      "b) 12 + (25 − 20)/(28 − 20) × 4 = 14.5 cm, estimated by interpolation.",
      "c) Estimated median at CF 20: 12 cm.",
      "d) CF(9) = 14, CF(17) = 29.25; difference 15.25, approximately 15 pencils.",
      "e) (40 − 36)/40 × 100 = 10%.",
      "f) 40 pencils."
    ],
    "answer": "a) 33. b) Approximately 14.5 cm by linear interpolation. c) Estimated median 12 cm, using CF 20. d) Approximately 15 pencils. e) 10%. f) 40. Grouped data do not establish the exact 25th observation or exact sample median.",
    "notation": true
  },
  "y11-maths-statistics/practice-8-Edexcel-Higher": {
    "question": "In a statistics task for Edexcel GCSE Higher (Box plots), the five-number summaries for two classes' scores (out of 100) are: Class A: minimum 42, Q1 55, median 68, Q3 83, maximum 97. Class B: minimum 38, Q1 50, median 60, Q3 78, maximum 92. Compare the two box plots. Your answer should state which class tends to score higher, compare the spread of scores, and comment on the overlap of the middle 50% of the data.",
    "hint": "Start with the medians to see which class tends to score higher.",
    "working": [
      "Step 1: Compare medians: Class A median = 68 marks, Class B median = 60 marks; Class A is higher by 8 marks.",
      "Step 2: Compare IQRs: IQR_A = 83 − 55 = 28 marks; IQR_B = 78 − 50 = 28 marks; the spreads of the middle 50% are the same.",
      "Step 3: Compare ranges: Range_A = 97 − 42 = 55 marks; Range_B = 92 − 38 = 54 marks; Class A has a slightly larger overall range by 1 mark.",
      "Step 4: Overlap of the middle 50%: A's IQR is 55–83 and B's IQR is 50–78; the overlap is from 55 to 78 marks, which means substantial overlap.",
      "Class A has higher quartiles and a higher median, but the central intervals overlap from 55 to 78 marks; neither middle half lies entirely above the other."
    ],
    "answer": "Class A has the higher median, 68 versus 60 marks. Both IQRs are 28 marks, so their middle halves have equal spread. Overall ranges are also similar: 55 for A and 54 for B. The central intervals, 55–83 and 50–78, overlap substantially from 55 to 78. A's quartiles are higher, but its middle half does not lie entirely above B's.",
    "notation": true
  },
  "y11-science-analysis/exam-3-AQA-Foundation": {
    "question": "Sample P contains only sodium chloride. Sample Q contains sodium chloride and sand. Explain which is pure and which is a mixture, and explain whether containing two different elements prevents P being pure.",
    "marks": 3,
    "markScheme": [
      "P is pure because it contains a single compound.",
      "Q is a mixture because it contains two substances that are not chemically combined.",
      "Sodium chloride contains sodium and chlorine chemically combined; a single compound can still be a pure substance."
    ],
    "answer": "P is pure because it contains a single compound. Q is a mixture because it contains two substances that are not chemically combined. Sodium chloride contains sodium and chlorine chemically combined; a single compound can still be a pure substance.",
    "notation": false
  },
  "y11-science-analysis/exam-3-AQA-Higher": {
    "question": "Sample P contains only sodium chloride. Sample Q contains sodium chloride and sand. Explain which is pure and which is a mixture, and explain whether containing two different elements prevents P being pure.",
    "marks": 3,
    "markScheme": [
      "P is pure because it contains a single compound.",
      "Q is a mixture because it contains two substances that are not chemically combined.",
      "Sodium chloride contains sodium and chlorine chemically combined; a single compound can still be a pure substance."
    ],
    "answer": "P is pure because it contains a single compound. Q is a mixture because it contains two substances that are not chemically combined. Sodium chloride contains sodium and chlorine chemically combined; a single compound can still be a pure substance.",
    "notation": false
  },
  "y11-science-analysis/exam-3-Edexcel-Foundation": {
    "question": "A paint is made with fixed proportions of pigment, solvent and binder. Explain why it is a formulation and why changing the proportions could alter its usefulness.",
    "marks": 3,
    "markScheme": [
      "Paint is a mixture deliberately designed for a purpose, so it is a formulation.",
      "Its components provide different properties, such as colour, ease of spreading and binding to a surface.",
      "Changing proportions can change those properties, so a useful formulation needs controlled amounts."
    ],
    "answer": "Paint is a mixture deliberately designed for a purpose, so it is a formulation. Its components provide different properties, such as colour, ease of spreading and binding to a surface. Changing proportions can change those properties, so a useful formulation needs controlled amounts.",
    "notation": false
  },
  "y11-science-analysis/exam-3-Edexcel-Higher": {
    "question": "A paint is made with fixed proportions of pigment, solvent and binder. Explain why it is a formulation and why changing the proportions could alter its usefulness.",
    "marks": 3,
    "markScheme": [
      "Paint is a mixture deliberately designed for a purpose, so it is a formulation.",
      "Its components provide different properties, such as colour, ease of spreading and binding to a surface.",
      "Changing proportions can change those properties, so a useful formulation needs controlled amounts."
    ],
    "answer": "Paint is a mixture deliberately designed for a purpose, so it is a formulation. Its components provide different properties, such as colour, ease of spreading and binding to a surface. Changing proportions can change those properties, so a useful formulation needs controlled amounts.",
    "notation": false
  },
  "y11-science-analysis/exam-9-AQA-Foundation": {
    "question": "At the same pressure, pure substance X melts sharply at 80 °C. A sample believed to be X melts over 73–78 °C. Explain what this suggests about purity and give one limit of the conclusion.",
    "marks": 3,
    "markScheme": [
      "A pure substance normally has a characteristic sharp melting point under fixed conditions.",
      "A lower, broader melting range suggests the sample contains impurities.",
      "The result does not identify the impurity or prove the substance is X; measurement uncertainty or a different substance must also be considered."
    ],
    "answer": "A pure substance normally has a characteristic sharp melting point under fixed conditions. A lower, broader melting range suggests the sample contains impurities. The result does not identify the impurity or prove the substance is X; measurement uncertainty or a different substance must also be considered.",
    "notation": false
  },
  "y11-science-analysis/exam-9-AQA-Higher": {
    "question": "At the same pressure, pure substance X melts sharply at 80 °C. A sample believed to be X melts over 73–78 °C. Explain what this suggests about purity and give one limit of the conclusion.",
    "marks": 3,
    "markScheme": [
      "A pure substance normally has a characteristic sharp melting point under fixed conditions.",
      "A lower, broader melting range suggests the sample contains impurities.",
      "The result does not identify the impurity or prove the substance is X; measurement uncertainty or a different substance must also be considered."
    ],
    "answer": "A pure substance normally has a characteristic sharp melting point under fixed conditions. A lower, broader melting range suggests the sample contains impurities. The result does not identify the impurity or prove the substance is X; measurement uncertainty or a different substance must also be considered.",
    "notation": false
  },
  "y11-science-analysis/exam-9-Edexcel-Foundation": {
    "question": "A bottle of drinking water is advertised as “pure”, but its label lists dissolved minerals. Explain the difference between potable water and a chemically pure substance.",
    "marks": 3,
    "markScheme": [
      "Potable water is water that is safe to drink.",
      "Dissolved minerals mean the sample contains more than one substance, so it is a mixture.",
      "Chemically pure water contains only water; ordinary use of “pure” on a label does not establish chemical purity."
    ],
    "answer": "Potable water is water that is safe to drink. Dissolved minerals mean the sample contains more than one substance, so it is a mixture. Chemically pure water contains only water; ordinary use of “pure” on a label does not establish chemical purity.",
    "notation": false
  },
  "y11-science-analysis/exam-9-Edexcel-Higher": {
    "question": "A bottle of drinking water is advertised as “pure”, but its label lists dissolved minerals. Explain the difference between potable water and a chemically pure substance.",
    "marks": 3,
    "markScheme": [
      "Potable water is water that is safe to drink.",
      "Dissolved minerals mean the sample contains more than one substance, so it is a mixture.",
      "Chemically pure water contains only water; ordinary use of “pure” on a label does not establish chemical purity."
    ],
    "answer": "Potable water is water that is safe to drink. Dissolved minerals mean the sample contains more than one substance, so it is a mixture. Chemically pure water contains only water; ordinary use of “pure” on a label does not establish chemical purity.",
    "notation": false
  },
  "y11-science-analysis/practice-3-AQA-Foundation": {
    "question": "Sample P contains only sodium chloride. Sample Q contains sodium chloride and sand. Explain which is pure and which is a mixture, and explain whether containing two different elements prevents P being pure.",
    "hint": "Use the chemical meaning of pure, mixture or formulation and apply it to the information given.",
    "working": [
      "P is pure because it contains a single compound.",
      "Q is a mixture because it contains two substances that are not chemically combined.",
      "Sodium chloride contains sodium and chlorine chemically combined; a single compound can still be a pure substance."
    ],
    "answer": "P is pure because it contains a single compound. Q is a mixture because it contains two substances that are not chemically combined. Sodium chloride contains sodium and chlorine chemically combined; a single compound can still be a pure substance.",
    "notation": false
  },
  "y11-science-analysis/practice-3-Edexcel-Foundation": {
    "question": "A paint is made with fixed proportions of pigment, solvent and binder. Explain why it is a formulation and why changing the proportions could alter its usefulness.",
    "hint": "Use the chemical meaning of pure, mixture or formulation and apply it to the information given.",
    "working": [
      "Paint is a mixture deliberately designed for a purpose, so it is a formulation.",
      "Its components provide different properties, such as colour, ease of spreading and binding to a surface.",
      "Changing proportions can change those properties, so a useful formulation needs controlled amounts."
    ],
    "answer": "Paint is a mixture deliberately designed for a purpose, so it is a formulation. Its components provide different properties, such as colour, ease of spreading and binding to a surface. Changing proportions can change those properties, so a useful formulation needs controlled amounts.",
    "notation": false
  },
  "y11-science-analysis/practice-7-Edexcel-Higher": {
    "question": "In a supervised demonstration, gas A relights a glowing splint; gas B turns limewater milky; gas C makes a squeaky pop with a lighted splint. Identify each gas and explain how each observation supports its identification.",
    "hint": "Remember which test results indicate oxygen, carbon dioxide and hydrogen.",
    "working": [
      "A is oxygen: it relights a glowing splint.",
      "B is carbon dioxide: it reacts with limewater to form an insoluble calcium carbonate precipitate, making it milky.",
      "C is hydrogen: its reaction with oxygen when ignited produces the characteristic squeaky pop."
    ],
    "answer": "A is oxygen, B is carbon dioxide and C is hydrogen. The milky appearance in the carbon-dioxide test is calcium carbonate precipitate.",
    "notation": false
  },
  "y11-science-analysis/practice-9-AQA-Foundation": {
    "question": "At the same pressure, pure substance X melts sharply at 80 °C. A sample believed to be X melts over 73–78 °C. Explain what this suggests about purity and give one limit of the conclusion.",
    "hint": "Use the chemical meaning of pure, mixture or formulation and apply it to the information given.",
    "working": [
      "A pure substance normally has a characteristic sharp melting point under fixed conditions.",
      "A lower, broader melting range suggests the sample contains impurities.",
      "The result does not identify the impurity or prove the substance is X; measurement uncertainty or a different substance must also be considered."
    ],
    "answer": "A pure substance normally has a characteristic sharp melting point under fixed conditions. A lower, broader melting range suggests the sample contains impurities. The result does not identify the impurity or prove the substance is X; measurement uncertainty or a different substance must also be considered.",
    "notation": false
  },
  "y11-science-analysis/practice-9-Edexcel-Foundation": {
    "question": "A bottle of drinking water is advertised as “pure”, but its label lists dissolved minerals. Explain the difference between potable water and a chemically pure substance.",
    "hint": "Use the chemical meaning of pure, mixture or formulation and apply it to the information given.",
    "working": [
      "Potable water is water that is safe to drink.",
      "Dissolved minerals mean the sample contains more than one substance, so it is a mixture.",
      "Chemically pure water contains only water; ordinary use of “pure” on a label does not establish chemical purity."
    ],
    "answer": "Potable water is water that is safe to drink. Dissolved minerals mean the sample contains more than one substance, so it is a mixture. Chemically pure water contains only water; ordinary use of “pure” on a label does not establish chemical purity.",
    "notation": false
  },
  "y11-science-atomic/exam-2-AQA-Foundation": {
    "question": "A student says that an alpha-emitting material is harmless because alpha radiation cannot pass through skin. Explain why this claim is incomplete and give one precaution against internal exposure.",
    "marks": 4,
    "markScheme": [
      "Alpha radiation is stopped by the outer skin, so its penetration from outside the body is low.",
      "If an alpha-emitting material is inhaled or swallowed, it can irradiate living tissue inside the body.",
      "Alpha radiation is strongly ionising and can damage cells.",
      "Keep radioactive material contained to prevent inhalation or ingestion."
    ],
    "answer": "Alpha radiation is stopped by the outer skin, so its penetration from outside the body is low. If an alpha-emitting material is inhaled or swallowed, it can irradiate living tissue inside the body. Alpha radiation is strongly ionising and can damage cells. Keep radioactive material contained to prevent inhalation or ingestion.",
    "notation": false
  },
  "y11-science-atomic/exam-2-AQA-Higher": {
    "question": "A student says that an alpha-emitting material is harmless because alpha radiation cannot pass through skin. Explain why this claim is incomplete and give one precaution against internal exposure.",
    "marks": 4,
    "markScheme": [
      "Alpha radiation is stopped by the outer skin, so its penetration from outside the body is low.",
      "If an alpha-emitting material is inhaled or swallowed, it can irradiate living tissue inside the body.",
      "Alpha radiation is strongly ionising and can damage cells.",
      "Keep radioactive material contained to prevent inhalation or ingestion."
    ],
    "answer": "Alpha radiation is stopped by the outer skin, so its penetration from outside the body is low. If an alpha-emitting material is inhaled or swallowed, it can irradiate living tissue inside the body. Alpha radiation is strongly ionising and can damage cells. Keep radioactive material contained to prevent inhalation or ingestion.",
    "notation": false
  },
  "y11-science-atomic/exam-2-Edexcel-Foundation": {
    "question": "Two workers use the same sealed gamma source with the same shielding. Worker A stays close to it for a long time; worker B stays farther away and reduces exposure time. Explain who is likely to receive the lower radiation dose and why dose should be limited.",
    "marks": 4,
    "markScheme": [
      "Worker B is likely to receive the lower dose.",
      "Reducing exposure time reduces the dose received.",
      "Increasing distance reduces exposure to the source.",
      "Ionising radiation can damage cells or DNA, so unnecessary exposure should be limited."
    ],
    "answer": "Worker B is likely to receive the lower dose. Reducing exposure time reduces the dose received. Increasing distance reduces exposure to the source. Ionising radiation can damage cells or DNA, so unnecessary exposure should be limited.",
    "notation": false
  },
  "y11-science-atomic/exam-2-Edexcel-Higher": {
    "question": "Two workers use the same sealed gamma source with the same shielding. Worker A stays close to it for a long time; worker B stays farther away and reduces exposure time. Explain who is likely to receive the lower radiation dose and why dose should be limited.",
    "marks": 4,
    "markScheme": [
      "Worker B is likely to receive the lower dose.",
      "Reducing exposure time reduces the dose received.",
      "Increasing distance reduces exposure to the source.",
      "Ionising radiation can damage cells or DNA, so unnecessary exposure should be limited."
    ],
    "answer": "Worker B is likely to receive the lower dose. Reducing exposure time reduces the dose received. Increasing distance reduces exposure to the source. Ionising radiation can damage cells or DNA, so unnecessary exposure should be limited.",
    "notation": false
  },
  "y11-science-atomic/exam-5-AQA-Foundation": {
    "question": "A sealed source irradiates a sample without leaking. In a separate incident, radioactive liquid spills onto a bench. Distinguish irradiation from contamination and explain why the bench remains a source of radiation after the original container is removed.",
    "marks": 4,
    "markScheme": [
      "Irradiation is exposure to radiation without necessarily transferring radioactive material.",
      "Contamination is unwanted radioactive material on or inside an object.",
      "The spilled radioactive material on the bench continues to emit radiation.",
      "The irradiated sample does not become radioactive merely because of this exposure."
    ],
    "answer": "Irradiation is exposure to radiation without necessarily transferring radioactive material. Contamination is unwanted radioactive material on or inside an object. The spilled radioactive material on the bench continues to emit radiation. The irradiated sample does not become radioactive merely because of this exposure.",
    "notation": false
  },
  "y11-science-atomic/exam-5-AQA-Higher": {
    "question": "A sealed source irradiates a sample without leaking. In a separate incident, radioactive liquid spills onto a bench. Distinguish irradiation from contamination and explain why the bench remains a source of radiation after the original container is removed.",
    "marks": 4,
    "markScheme": [
      "Irradiation is exposure to radiation without necessarily transferring radioactive material.",
      "Contamination is unwanted radioactive material on or inside an object.",
      "The spilled radioactive material on the bench continues to emit radiation.",
      "The irradiated sample does not become radioactive merely because of this exposure."
    ],
    "answer": "Irradiation is exposure to radiation without necessarily transferring radioactive material. Contamination is unwanted radioactive material on or inside an object. The spilled radioactive material on the bench continues to emit radiation. The irradiated sample does not become radioactive merely because of this exposure.",
    "notation": false
  },
  "y11-science-atomic/exam-5-Edexcel-Foundation": {
    "question": "A worker has radioactive dust on a glove. Another worker stands near a sealed source without touching any radioactive material. Compare contamination and irradiation in these situations.",
    "marks": 4,
    "markScheme": [
      "Radioactive dust on the glove is contamination because radioactive material has been transferred.",
      "The second worker is irradiated: radiation reaches them without transfer of radioactive material.",
      "The contaminated glove can continue to emit radiation while the dust remains.",
      "Exposure from the sealed source ends when the worker is no longer exposed to it; this does not undo any damage already caused."
    ],
    "answer": "Radioactive dust on the glove is contamination because radioactive material has been transferred. The second worker is irradiated: radiation reaches them without transfer of radioactive material. The contaminated glove can continue to emit radiation while the dust remains. Exposure from the sealed source ends when the worker is no longer exposed to it; this does not undo any damage already caused.",
    "notation": false
  },
  "y11-science-atomic/exam-5-Edexcel-Higher": {
    "question": "A worker has radioactive dust on a glove. Another worker stands near a sealed source without touching any radioactive material. Compare contamination and irradiation in these situations.",
    "marks": 4,
    "markScheme": [
      "Radioactive dust on the glove is contamination because radioactive material has been transferred.",
      "The second worker is irradiated: radiation reaches them without transfer of radioactive material.",
      "The contaminated glove can continue to emit radiation while the dust remains.",
      "Exposure from the sealed source ends when the worker is no longer exposed to it; this does not undo any damage already caused."
    ],
    "answer": "Radioactive dust on the glove is contamination because radioactive material has been transferred. The second worker is irradiated: radiation reaches them without transfer of radioactive material. The contaminated glove can continue to emit radiation while the dust remains. Exposure from the sealed source ends when the worker is no longer exposed to it; this does not undo any damage already caused.",
    "notation": false
  },
  "y11-science-atomic/exam-8-AQA-Foundation": {
    "question": "Explain why thin paper can shield against alpha radiation but is unsuitable as the only shielding for gamma radiation. Explain why containing the radioactive material still matters.",
    "marks": 4,
    "markScheme": [
      "Alpha radiation has low penetrating power and is stopped by paper.",
      "Gamma radiation is much more penetrating and passes through thin paper.",
      "Thick lead or concrete reduces gamma exposure but does not necessarily remove it completely.",
      "Containment reduces the risk that radioactive material is inhaled or swallowed."
    ],
    "answer": "Alpha radiation has low penetrating power and is stopped by paper. Gamma radiation is much more penetrating and passes through thin paper. Thick lead or concrete reduces gamma exposure but does not necessarily remove it completely. Containment reduces the risk that radioactive material is inhaled or swallowed.",
    "notation": false
  },
  "y11-science-atomic/exam-8-AQA-Higher": {
    "question": "Explain why thin paper can shield against alpha radiation but is unsuitable as the only shielding for gamma radiation. Explain why containing the radioactive material still matters.",
    "marks": 4,
    "markScheme": [
      "Alpha radiation has low penetrating power and is stopped by paper.",
      "Gamma radiation is much more penetrating and passes through thin paper.",
      "Thick lead or concrete reduces gamma exposure but does not necessarily remove it completely.",
      "Containment reduces the risk that radioactive material is inhaled or swallowed."
    ],
    "answer": "Alpha radiation has low penetrating power and is stopped by paper. Gamma radiation is much more penetrating and passes through thin paper. Thick lead or concrete reduces gamma exposure but does not necessarily remove it completely. Containment reduces the risk that radioactive material is inhaled or swallowed.",
    "notation": false
  },
  "y11-science-atomic/exam-8-Edexcel-Foundation": {
    "question": "A person leaves an area near a sealed radioactive source. No radioactive material has escaped onto them. Explain why the person should not be described as radioactive, although their earlier exposure may have caused harm.",
    "marks": 4,
    "markScheme": [
      "The person was irradiated by radiation from the source.",
      "No radioactive material was transferred, so they were not contaminated.",
      "Irradiation in this context does not make the person radioactive.",
      "Radiation received earlier can still have damaged cells or DNA."
    ],
    "answer": "The person was irradiated by radiation from the source. No radioactive material was transferred, so they were not contaminated. Irradiation in this context does not make the person radioactive. Radiation received earlier can still have damaged cells or DNA.",
    "notation": false
  },
  "y11-science-atomic/exam-8-Edexcel-Higher": {
    "question": "A person leaves an area near a sealed radioactive source. No radioactive material has escaped onto them. Explain why the person should not be described as radioactive, although their earlier exposure may have caused harm.",
    "marks": 4,
    "markScheme": [
      "The person was irradiated by radiation from the source.",
      "No radioactive material was transferred, so they were not contaminated.",
      "Irradiation in this context does not make the person radioactive.",
      "Radiation received earlier can still have damaged cells or DNA."
    ],
    "answer": "The person was irradiated by radiation from the source. No radioactive material was transferred, so they were not contaminated. Irradiation in this context does not make the person radioactive. Radiation received earlier can still have damaged cells or DNA.",
    "notation": false
  },
  "y11-science-atomic/practice-1-Edexcel-Foundation": {
    "question": "Question 2: A sample of radioactive material has an initial activity of 240 Bq. The half-life of the isotope is 3 hours. i) What is meant by the half-life of a radioactive isotope? ii) Calculate the activity after 9 hours. Give your answer in Bq.",
    "hint": "Think about how many times the activity halves in 9 hours.",
    "working": [
      "Number of half-lives = 9 ÷ 3 = 3",
      "After 1 half-life: 240 ÷ 2 = 120 Bq",
      "After 2 half-lives: 120 ÷ 2 = 60 Bq",
      "After 3 half-lives: 60 ÷ 2 = 30 Bq"
    ],
    "answer": "Half-life is the time for the activity, or the number of undecayed radioactive nuclei, to fall to half its initial value. Nine hours is three half-lives: 240 → 120 → 60 → 30 Bq.",
    "notation": false
  },
  "y11-science-atomic/practice-2-AQA-Foundation": {
    "question": "A student says that an alpha-emitting material is harmless because alpha radiation cannot pass through skin. Explain why this claim is incomplete and give one precaution against internal exposure.",
    "hint": "Use the information given and explain the scientific reasoning.",
    "working": [
      "Alpha radiation is stopped by the outer skin, so its penetration from outside the body is low.",
      "If an alpha-emitting material is inhaled or swallowed, it can irradiate living tissue inside the body.",
      "Alpha radiation is strongly ionising and can damage cells.",
      "Keep radioactive material contained to prevent inhalation or ingestion."
    ],
    "answer": "Alpha radiation is stopped by the outer skin, so its penetration from outside the body is low. If an alpha-emitting material is inhaled or swallowed, it can irradiate living tissue inside the body. Alpha radiation is strongly ionising and can damage cells. Keep radioactive material contained to prevent inhalation or ingestion.",
    "notation": false
  },
  "y11-science-atomic/practice-2-AQA-Higher": {
    "question": "A student says that an alpha-emitting material is harmless because alpha radiation cannot pass through skin. Explain why this claim is incomplete and give one precaution against internal exposure.",
    "hint": "Use the information given and explain the scientific reasoning.",
    "working": [
      "Alpha radiation is stopped by the outer skin, so its penetration from outside the body is low.",
      "If an alpha-emitting material is inhaled or swallowed, it can irradiate living tissue inside the body.",
      "Alpha radiation is strongly ionising and can damage cells.",
      "Keep radioactive material contained to prevent inhalation or ingestion."
    ],
    "answer": "Alpha radiation is stopped by the outer skin, so its penetration from outside the body is low. If an alpha-emitting material is inhaled or swallowed, it can irradiate living tissue inside the body. Alpha radiation is strongly ionising and can damage cells. Keep radioactive material contained to prevent inhalation or ingestion.",
    "notation": false
  },
  "y11-science-atomic/practice-2-Edexcel-Higher": {
    "question": "Two workers use the same sealed gamma source with the same shielding. Worker A stays close to it for a long time; worker B stays farther away and reduces exposure time. Explain who is likely to receive the lower radiation dose and why dose should be limited.",
    "hint": "Use the information given and explain the scientific reasoning.",
    "working": [
      "Worker B is likely to receive the lower dose.",
      "Reducing exposure time reduces the dose received.",
      "Increasing distance reduces exposure to the source.",
      "Ionising radiation can damage cells or DNA, so unnecessary exposure should be limited."
    ],
    "answer": "Worker B is likely to receive the lower dose. Reducing exposure time reduces the dose received. Increasing distance reduces exposure to the source. Ionising radiation can damage cells or DNA, so unnecessary exposure should be limited.",
    "notation": false
  },
  "y11-science-atomic/practice-5-AQA-Foundation": {
    "question": "A sealed source irradiates a sample without leaking. In a separate incident, radioactive liquid spills onto a bench. Distinguish irradiation from contamination and explain why the bench remains a source of radiation after the original container is removed.",
    "hint": "Use the information given and explain the scientific reasoning.",
    "working": [
      "Irradiation is exposure to radiation without necessarily transferring radioactive material.",
      "Contamination is unwanted radioactive material on or inside an object.",
      "The spilled radioactive material on the bench continues to emit radiation.",
      "The irradiated sample does not become radioactive merely because of this exposure."
    ],
    "answer": "Irradiation is exposure to radiation without necessarily transferring radioactive material. Contamination is unwanted radioactive material on or inside an object. The spilled radioactive material on the bench continues to emit radiation. The irradiated sample does not become radioactive merely because of this exposure.",
    "notation": false
  },
  "y11-science-atomic/practice-5-AQA-Higher": {
    "question": "A student argues that a source with a long half-life must always be more dangerous than one with a short half-life. Explain why half-life alone is insufficient to judge the risk.",
    "hint": "Use the information given and explain the scientific reasoning.",
    "working": [
      "Half-life describes how quickly activity falls and how long a source remains active.",
      "Risk also depends on activity and the type of radiation emitted.",
      "Exposure time, distance and shielding affect the dose received.",
      "Whether radioactive material enters the body also matters, so half-life alone cannot rank the risks."
    ],
    "answer": "Half-life describes how quickly activity falls and how long a source remains active. Risk also depends on activity and the type of radiation emitted. Exposure time, distance and shielding affect the dose received. Whether radioactive material enters the body also matters, so half-life alone cannot rank the risks.",
    "notation": false
  },
  "y11-science-atomic/practice-5-Edexcel-Foundation": {
    "question": "A worker has radioactive dust on a glove. Another worker stands near a sealed source without touching any radioactive material. Compare contamination and irradiation in these situations.",
    "hint": "Use the information given and explain the scientific reasoning.",
    "working": [
      "Radioactive dust on the glove is contamination because radioactive material has been transferred.",
      "The second worker is irradiated: radiation reaches them without transfer of radioactive material.",
      "The contaminated glove can continue to emit radiation while the dust remains.",
      "Exposure from the sealed source ends when the worker is no longer exposed to it; this does not undo any damage already caused."
    ],
    "answer": "Radioactive dust on the glove is contamination because radioactive material has been transferred. The second worker is irradiated: radiation reaches them without transfer of radioactive material. The contaminated glove can continue to emit radiation while the dust remains. Exposure from the sealed source ends when the worker is no longer exposed to it; this does not undo any damage already caused.",
    "notation": false
  },
  "y11-science-atomic/practice-5-Edexcel-Higher": {
    "question": "Explain how a sealed radioactive source can still expose someone to radiation, and explain two ways to reduce that exposure.",
    "hint": "Use the information given and explain the scientific reasoning.",
    "working": [
      "A sealed source contains radioactive material but may emit radiation through its container.",
      "This radiation can ionise and damage living cells.",
      "Reducing time near the source reduces exposure.",
      "Increasing distance or using suitable shielding reduces exposure; credit either with a correct explanation."
    ],
    "answer": "A sealed source contains radioactive material but may emit radiation through its container. This radiation can ionise and damage living cells. Reducing time near the source reduces exposure. Increasing distance or using suitable shielding reduces exposure; credit either with a correct explanation.",
    "notation": false
  },
  "y11-science-atomic/practice-8-AQA-Foundation": {
    "question": "Explain why thin paper can shield against alpha radiation but is unsuitable as the only shielding for gamma radiation. Explain why containing the radioactive material still matters.",
    "hint": "Use the information given and explain the scientific reasoning.",
    "working": [
      "Alpha radiation has low penetrating power and is stopped by paper.",
      "Gamma radiation is much more penetrating and passes through thin paper.",
      "Thick lead or concrete reduces gamma exposure but does not necessarily remove it completely.",
      "Containment reduces the risk that radioactive material is inhaled or swallowed."
    ],
    "answer": "Alpha radiation has low penetrating power and is stopped by paper. Gamma radiation is much more penetrating and passes through thin paper. Thick lead or concrete reduces gamma exposure but does not necessarily remove it completely. Containment reduces the risk that radioactive material is inhaled or swallowed.",
    "notation": false
  },
  "y11-science-atomic/practice-8-AQA-Higher": {
    "question": "Explain why thin paper can shield against alpha radiation but is unsuitable as the only shielding for gamma radiation. Explain why containing the radioactive material still matters.",
    "hint": "Use the information given and explain the scientific reasoning.",
    "working": [
      "Alpha radiation has low penetrating power and is stopped by paper.",
      "Gamma radiation is much more penetrating and passes through thin paper.",
      "Thick lead or concrete reduces gamma exposure but does not necessarily remove it completely.",
      "Containment reduces the risk that radioactive material is inhaled or swallowed."
    ],
    "answer": "Alpha radiation has low penetrating power and is stopped by paper. Gamma radiation is much more penetrating and passes through thin paper. Thick lead or concrete reduces gamma exposure but does not necessarily remove it completely. Containment reduces the risk that radioactive material is inhaled or swallowed.",
    "notation": false
  },
  "y11-science-atomic/practice-8-Edexcel-Foundation": {
    "question": "A person leaves an area near a sealed radioactive source. No radioactive material has escaped onto them. Explain why the person should not be described as radioactive, although their earlier exposure may have caused harm.",
    "hint": "Use the information given and explain the scientific reasoning.",
    "working": [
      "The person was irradiated by radiation from the source.",
      "No radioactive material was transferred, so they were not contaminated.",
      "Irradiation in this context does not make the person radioactive.",
      "Radiation received earlier can still have damaged cells or DNA."
    ],
    "answer": "The person was irradiated by radiation from the source. No radioactive material was transferred, so they were not contaminated. Irradiation in this context does not make the person radioactive. Radiation received earlier can still have damaged cells or DNA.",
    "notation": false
  },
  "y11-science-atomic/practice-8-Edexcel-Higher": {
    "question": "A person leaves an area near a sealed radioactive source. No radioactive material has escaped onto them. Explain why the person should not be described as radioactive, although their earlier exposure may have caused harm.",
    "hint": "Use the information given and explain the scientific reasoning.",
    "working": [
      "The person was irradiated by radiation from the source.",
      "No radioactive material was transferred, so they were not contaminated.",
      "Irradiation in this context does not make the person radioactive.",
      "Radiation received earlier can still have damaged cells or DNA."
    ],
    "answer": "The person was irradiated by radiation from the source. No radioactive material was transferred, so they were not contaminated. Irradiation in this context does not make the person radioactive. Radiation received earlier can still have damaged cells or DNA.",
    "notation": false
  },
  "y11-science-ecology/exam-8-AQA-Higher": {
    "question": "Evaluate strategies to reduce the ecological impact of a new housing development in the Ecology and Human Impact topic for GCSE (AQA Higher, KS4). A local council plans a development of 100 homes on greenfield land adjacent to a hedgerow. To lessen ecological damage, three strategies are under consideration: Strategy A: Create a native-tree wildlife corridor along the development boundary. Upfront cost: £40,000. It is estimated to increase the number of breeding wildlife species in the area by 8 within five years. Strategy B: Install solar panels on the roofs of all 100 homes. Upfront cost: £6,000 per home (£600,000 total). It is estimated to save 220,000 kWh of electricity per year, which saves about £44,000 per year at £0.20 per kWh, and to reduce carbon emissions by about 40 tonnes CO2 per year. Strategy C: Improve public transport by providing a dedicated bus service with four new buses. Upfront cost: £100,000. Annual running cost: £40,000. It is estimated to reduce residents’ car trips by 8,000 per year and to cut CO2 emissions by 16 tonnes per year. The council has a total budget of £1.2 million for these strategies over five years. Your answer should evaluate these strategies for environmental impact, cost to the council, and practicality/public acceptability, and make a justified recommendation about which strategy or combination should be prioritised.",
    "marks": 6,
    "markScheme": [
      "Explains the biodiversity impact of Strategy A and why it benefits local wildlife.",
      "Explains how Strategy B would affect energy use and emissions, using the provided data.",
      "Explains how Strategy C would affect car use and emissions, using the provided data.",
      "Compares costs and potential payback or running costs for at least two strategies.",
      "Assesses practicality and public acceptability for at least one strategy.",
      "Gives a clear, justified overall recommendation considering all factors."
    ],
    "answer": "A supports habitat connectivity for £40,000 upfront, with an estimated increase of eight breeding species; this is a forecast, not a guaranteed outcome. B costs £600,000 and saves an estimated £44,000 of electricity annually: £220,000 over five years, with a simple payback of about 13.6 years before maintenance. C costs £100,000 upfront plus £40,000 annually, or £300,000 over five years. All three have stated five-year expenditure of £40,000 + £600,000 + £300,000 = £940,000, within the £1.2 million budget before unlisted costs. B and C together save an estimated 56 tonnes CO2 annually, or 280 tonnes over five years. Household electricity savings do not automatically reimburse the council. A phased combination is defensible, subject to roof suitability, maintenance, resident uptake and monitoring of ecological outcomes.",
    "notation": false
  },
  "y11-science-ecology/exam-8-Edexcel-Foundation": {
    "question": "Evaluate the strategies the school has chosen to reduce its ecological footprint. Use the information below and explain which strategy offers the best balance of cost savings and environmental benefit. Strategy A: LED lighting upgrade. Upfront cost £5200. Annual saving on electricity £1200. Lifespan 10 years. Strategy B: Extra roof insulation. Upfront cost £4200. Annual saving on heating £900. Lifespan 15 years. Strategy C: School recycling scheme for paper and plastics. Upfront cost £1000. Annual saving on waste disposal costs £320. Lifespan 8 years. Assume savings occur each year and remain constant over time; ignore changes in prices and maintenance costs not listed.",
    "marks": 6,
    "markScheme": [
      "Correctly calculate LED payback: 5200 ÷ 1200 ≈ 4.3 years.",
      "Correctly calculate insulation payback: 4200 ÷ 900 ≈ 4.7 years.",
      "Correctly calculate recycling payback: 1000 ÷ 320 ≈ 3.1 years.",
      "Identify that recycling has the shortest payback period (≈3.1 years).",
      "Explain that, beyond payback, strategies differ in environmental impact (LED and insulation reduce energy use and emissions; recycling reduces waste) and that payback alone is not the full measure.",
      "Provide a justified recommendation or phased approach considering both cost savings and environmental benefit (e.g., start with recycling for quick savings, then consider LED and insulation for greater energy/emission reductions)."
    ],
    "answer": "LED payback ≈ £5200 ÷ £1200 per year = 4.3 years. Insulation payback ≈ £4200 ÷ £900 per year = 4.7 years. Recycling payback ≈ £1000 ÷ £320 per year = 3.1 years. Therefore, recycling has the shortest payback and offers the quickest monetary return. However, LED lighting and insulation reduce energy use and associated emissions, while recycling reduces waste. The data do not quantify those environmental benefits, so they cannot establish which strategy has the largest environmental effect. A sensible plan would be to implement the recycling scheme first for rapid savings and waste reduction, then consider installing LED lighting to cut electricity use, followed by improving insulation for further heating savings. This phased approach gives a balance between short-term cost savings and longer-term environmental benefits.",
    "notation": false
  },
  "y11-science-ecology/practice-0-AQA-Higher": {
    "question": "In a field study, researchers counted individuals of three insect species (A, B and C) in two habitats: woodland and hedgerow. The counts are: Woodland: A = 40, B = 60, C = 20. Hedgerow: A = 15, B = 15, C = 70. Answer the following: (a) Calculate the total number of individuals in each habitat. (b) Calculate the relative abundance (as a percentage) of each species in each habitat. (c) Which habitat has the greater total abundance? (d) In which habitat is species B most dominant (highest proportion of that habitat’s individuals)? (e) Across both habitats, what percentage of all insects counted are species C?",
    "hint": "Look for the overall totals first to compare habitats.",
    "working": [
      "Step 1: Woodland total = 40 + 60 + 20 = 120",
      "Step 2: Hedgerow total = 15 + 15 + 70 = 100",
      "Step 3: Woodland A proportion = 40 / 120 = 0.333... = 33.3%",
      "Step 4: Woodland B proportion = 60 / 120 = 0.50 = 50%",
      "Step 5: Woodland C proportion = 20 / 120 = 0.166... = 16.7%",
      "Step 6: Hedgerow A proportion = 15 / 100 = 0.15 = 15%",
      "Step 7: Hedgerow B proportion = 15 / 100 = 0.15 = 15%",
      "Step 8: Hedgerow C proportion = 70 / 100 = 0.70 = 70%",
      "Step 9: Which habitat has greater total abundance? Woodland (120 > 100)",
      "Step 10: In which habitat is species B most dominant? Woodland (50% vs 15%)",
      "Step 11: Across both habitats, total individuals = 120 + 100 = 220",
      "Step 12: Species C across both = 20 + 70 = 90; percentage = 90 / 220 × 100 = 40.9%"
    ],
    "answer": "(a) Woodland: 120; hedgerow: 100. (b) Woodland A: 33.3%, B: 50%, C: 16.7%; hedgerow A: 15%, B: 15%, C: 70%. (c) Woodland has the greater count, 120 compared with 100. (d) Species B has the higher proportion in woodland, 50% compared with 15%. (e) Species C contributes 90 of the 220 insects, approximately 40.9%.",
    "notation": false
  },
  "y11-science-ecology/practice-1-Edexcel-Higher": {
    "question": "Explain how material cycles operate in an arable field and evaluate how the farming practices described below would alter these cycles and impact the environment. In a 1 hectare field, the soil initially contains 2500 kg of organic carbon per hectare. Each year crop residues decomposing add 180 kg of carbon per hectare to the soil, while the soil releases 1200 kg of CO2 per hectare per year through respiration. The farmer applies 40 kg of nitrogen fertiliser per hectare per year. Of this fertiliser, 60% is taken up by the crops, 25% is lost to leaching, and 15% remains in the soil as organic nitrogen after the decomposition of residues. The field produces 5.4 tonnes of cereal per hectare per year. For this simplified balance, assume all reported soil CO2 comes from the stated soil organic-carbon store and no other carbon inputs or outputs occur. Carbon is 12/44 of the mass of CO2.",
    "hint": "Think about where carbon and nitrogen go—into the soil, into the crops, or into the air—and what leaching does to water quality.",
    "working": [
      "Step 1: Convert CO2 released to carbon mass.",
      "CO2 emitted = 1200 kg CO2 per hectare per year.",
      "Carbon in CO2 = 1200 × (12/44) = 327 kg C per hectare per year.",
      "Step 2: Find the annual net change in soil carbon.",
      "Carbon added by residues = 180 kg C/ha/year.",
      "Net soil carbon change = 180 − 327 = −147 kg C per hectare per year.",
      "Step 3: Determine the fate of the fertiliser nitrogen.",
      "Input N = 40 kg N/ha/year.",
      "Uptake by crops = 60% of input = 0.60 × 40 = 24 kg N.",
      "Loss to leaching = 25% of input = 0.25 × 40 = 10 kg N.",
      "Remaining in soil as organic N = 15% of input = 0.15 × 40 = 6 kg N.",
      "Step 4: Summarise the nitrogen and carbon outcomes.",
      "Carbon: soil carbon decreases by 147 kg C/ha/year (net loss to atmosphere outweighs input from residues).",
      "Nitrogen: 24 kg N used by crops, 10 kg N lost to leaching, 6 kg N remaining in soil as organic N; overall, a portion of applied N is taken up, and some is lost to leaching, with a small amount stored as soil organic N."
    ],
    "answer": "Under the simplified assumptions, respiration releases 1200 x 12/44 = about 327 kg carbon per hectare annually. Residues add 180 kg, so net soil carbon change is about -147 kg per hectare per year. Fertiliser nitrogen divides into 24 kg taken up by crops, 10 kg leached and 6 kg remaining as organic nitrogen.\n\nPlants take carbon from atmospheric CO2 during photosynthesis. Feeding, respiration and decomposition transfer carbon between organisms, soil and atmosphere. Residues return material to soil, while harvesting removes some plant material. Nitrogen absorbed by crops supports growth; leached nutrients can affect water quality and contribute to excessive algal growth.\n\nReturning residues or adjusting fertiliser timing could alter these transfers, but the data do not establish an optimal management plan. Actual soil respiration includes several sources, and other inputs, outputs, weather and crop demands must be measured before applying this simplified balance to a real field.",
    "notation": false
  },
  "y11-science-ecology/practice-2-AQA-Foundation": {
    "question": "A local council is planning to reduce litter and protect wildlife in Willow Park. They are considering four strategies: A) install 20 extra litter bins and post clear signs; cost £6 000 one-off, plus £2 000 per year for emptying and maintenance. B) run an education programme in local schools about keeping the park clean; cost £1 500 per year. C) plant a native hedgerow along 600 metres of the park boundary; cost £18 000; expected to increase plant biodiversity by 6 new species and reduce encroachment by 30% (which helps protect habitat). D) introduce a £1 entry fee for park visitors; this is expected to reduce visitor numbers by 15% (to 17 000 per year) and generate revenue of £17 000 per year to help fund maintenance. The park currently experiences 1 500 items of litter per year baseline. For each strategy, explain whether the information permits calculation of an annual litter reduction and state any major advantages or drawbacks for wildlife and for park users. Can the information establish which strategy gives best first-year value for reducing litter? Explain what is missing.",
    "hint": "Check whether litter effects and full costs are actually supplied before calculating.",
    "working": [
      "A's first-year stated cost is £6000 + £2000 = £8000; no litter-reduction percentage is given.",
      "B costs £1500 annually, but its effect on litter is not supplied.",
      "C targets biodiversity and encroachment; these are not measurements of litter reduction.",
      "D reduces visitor numbers by 15%, but that does not necessarily reduce litter by 15%. Its operating costs are not supplied."
    ],
    "answer": "The data cannot rank first-year litter cost-effectiveness. A costs £8,000 in year one and B costs £1,500, but neither has a stated litter effect. C costs £18,000 and targets habitat benefits; no measured litter reduction is given. D has predicted revenue of £17,000, but revenue is not profit and its implementation costs are unknown. A 15% visitor reduction does not prove the same reduction in litter, and an entry fee could reduce access for some users. Obtain comparable litter measurements, full costs and evidence of wildlife and access impacts before selecting a strategy.",
    "notation": false
  },
  "y11-science-ecology/practice-8-AQA-Higher": {
    "question": "Evaluate the three strategies for reducing a school's ecological footprint over five years, using the data below: A) Install solar panels on the school roof. Install cost £80 000; Annual energy produced 42 000 kWh; Price of electricity £0.18 per kWh; Annual maintenance £120; Estimated annual CO2 reduction 9.8 tonnes. B) Run a canteen food-waste reduction campaign. Annual campaign cost £900; Waste reduced 8 tonnes per year; Disposal saving £60 per tonne; The campaign also reduces methane emissions from landfill (not quantified here). C) Create a wildflower meadow around the school grounds. Establishment cost £6 000; Annual maintenance £260; Biodiversity and educational benefits are qualitative. Over five years, calculate the net monetary benefit for each option and discuss the non-monetary benefits. Assume all electricity generated replaces purchases at the stated price, all annual values remain constant and no discounting is applied.",
    "hint": "Think about both the money saved and the non-monetary benefits like biodiversity and education, and remember maintenance costs.",
    "working": [
      "Solar annual net saving = 42000 x £0.18 - £120 = £7440.",
      "Solar five-year net benefit = 5 x £7440 - £80000 = -£42800.",
      "Food-waste campaign = 5 x (8 x £60 - £900) = -£2100.",
      "Meadow = -£6000 - 5 x £260 = -£7300.",
      "Solar avoids an estimated 49 tonnes CO2 over five years. Waste and meadow benefits are described but not given on a comparable scale."
    ],
    "answer": "Five-year net monetary benefits are solar -£42,800, food-waste campaign -£2,100 and meadow -£7,300 under the stated assumptions. All three cost more than their quantified savings over this period; the waste campaign has the smallest net cost. Solar has an estimated 49-tonne CO2 reduction, while the campaign reduces waste and the meadow may benefit biodiversity and learning. Those different, partly unquantified benefits cannot establish a single greatest ecological benefit. Choose according to the school's objectives, budget and longer-term evidence.",
    "notation": false
  },
  "y11-science-ecology/practice-8-Edexcel-Higher": {
    "question": "Question 9 (Edexcel Higher, Ecology and Human Impact) The council of Greenfield Town wants to reduce its annual CO2 emissions from transport and heating by at least 600 tonnes per year. Data for three proposed strategies are given below. Current emissions: 2,400 tonnes CO2 per year. Strategy A: Cycling/walking infrastructure. Estimated reduction: 900 tonnes CO2 per year. Initial cost £12,000,000. Annual maintenance £600,000. Strategy B: Solar panels on public buildings. Estimated reduction: 400 tonnes CO2 per year. Initial cost £4,000,000. Annual maintenance £150,000. Strategy C: Electric buses in town fleet. Estimated reduction: 700 tonnes CO2 per year. Initial cost £14,000,000. Annual maintenance £900,000. Full implementation times: A 3–5 years; B 1 year; C 2–3 years. Evaluate which single strategy or combination would best meet the aim, considering cost, time to implement and other impacts (for example disruption, public support).",
    "hint": "Compare not only how much CO2 is saved, but also how quickly the savings start and how the costs fit with the town’s budget.",
    "working": [
      "A and C meet the 600-tonne annual target once fully implemented; B alone does not.",
      "A has lower capital and annual maintenance costs than C and a larger stated annual reduction, but A takes 3–5 years rather than C's 2–3.",
      "Assuming independent additive reductions, A+B would reduce emissions by 1300 tonnes annually after full implementation, at £16m capital cost and £750000 annual maintenance.",
      "Financial payback cannot be calculated because monetary savings or revenues are not supplied. Dividing pounds by tonnes per year does not give payback in years."
    ],
    "answer": "A is attractive if cost and eventual reduction are prioritised: £12m capital and £0.6m annual maintenance for 900 tonnes avoided each year after implementation. C reaches the target sooner, in 2–3 rather than 3–5 years, but costs £14m plus £0.9m annual maintenance for 700 tonnes annually. B can be implemented in one year but its 400-tonne reduction alone misses the target.\n\nIf effects are independent, A+B could achieve 1300 tonnes per year after both are complete, for £16m capital and £0.75m annual maintenance. It would not meet the target immediately through B alone. Check overlap, disruption, public support and the actual deadline before recommending a combination. No budget ceiling or monetary savings are stated, so affordability and financial payback cannot be determined.",
    "notation": false
  },
  "y11-science-homeostasis/exam-1-AQA-Foundation": {
    "question": "A student says insulin is produced by the liver. Correct the statement and describe how insulin affects glucose storage.",
    "marks": 3,
    "markScheme": [
      "The pancreas releases insulin when blood glucose is high.",
      "Insulin promotes movement of glucose from blood into cells.",
      "It promotes conversion of glucose to glycogen for storage in liver and muscle, helping lower blood glucose."
    ],
    "answer": "The pancreas releases insulin when blood glucose is high. Insulin promotes movement of glucose from blood into cells. It promotes conversion of glucose to glycogen for storage in liver and muscle, helping lower blood glucose.",
    "notation": false
  },
  "y11-science-homeostasis/exam-1-Edexcel-Foundation": {
    "question": "A person’s blood glucose rises after eating and later falls towards its usual range. Explain the role of the pancreas and insulin in this change.",
    "marks": 3,
    "markScheme": [
      "The pancreas releases insulin when blood glucose is high.",
      "Insulin promotes movement of glucose from blood into cells.",
      "It promotes conversion of glucose to glycogen for storage in liver and muscle, helping lower blood glucose."
    ],
    "answer": "The pancreas releases insulin when blood glucose is high. Insulin promotes movement of glucose from blood into cells. It promotes conversion of glucose to glycogen for storage in liver and muscle, helping lower blood glucose.",
    "notation": false
  },
  "y11-science-homeostasis/exam-4-Edexcel-Foundation": {
    "question": "Describe how the endocrine system carries messages. Use insulin as an example, naming its source and one effect.",
    "marks": 3,
    "markScheme": [
      "Endocrine glands release hormones into the bloodstream.",
      "Hormones travel to target organs and change their activity.",
      "The pancreas releases insulin, which lowers blood glucose by promoting glucose uptake and storage."
    ],
    "answer": "Endocrine glands release hormones into the bloodstream. Hormones travel to target organs and change their activity. The pancreas releases insulin, which lowers blood glucose by promoting glucose uptake and storage.",
    "notation": false
  },
  "y11-science-homeostasis/exam-7-AQA-Foundation": {
    "question": "A student confuses glucose with glycogen. Explain the difference in the context of insulin’s action after a meal.",
    "marks": 3,
    "markScheme": [
      "The pancreas releases insulin when blood glucose is high.",
      "Insulin promotes movement of glucose from blood into cells.",
      "It promotes conversion of glucose to glycogen for storage in liver and muscle, helping lower blood glucose."
    ],
    "answer": "The pancreas releases insulin when blood glucose is high. Insulin promotes movement of glucose from blood into cells. It promotes conversion of glucose to glycogen for storage in liver and muscle, helping lower blood glucose.",
    "notation": false
  },
  "y11-science-homeostasis/exam-7-Edexcel-Foundation": {
    "question": "Blood glucose rises after a meal. Explain how insulin helps correct the rise.",
    "marks": 3,
    "markScheme": [
      "The pancreas releases insulin when blood glucose is high.",
      "Insulin promotes movement of glucose from blood into cells.",
      "It promotes conversion of glucose to glycogen for storage in liver and muscle, helping lower blood glucose."
    ],
    "answer": "The pancreas releases insulin when blood glucose is high. Insulin promotes movement of glucose from blood into cells. It promotes conversion of glucose to glycogen for storage in liver and muscle, helping lower blood glucose.",
    "notation": false
  },
  "y11-science-homeostasis/practice-0-Edexcel-Foundation": {
    "question": "Explain the withdrawal reflex when a person touches a dangerously hot surface. Name the receptor, sensory neurone, relay neurone, motor neurone and effector, and explain why the response does not require a conscious decision.",
    "hint": "Trace the pathway from skin receptors through the spinal cord to a muscle.",
    "working": [
      "Receptors in the skin detect the harmful stimulus.",
      "An impulse travels along a sensory neurone to the spinal cord.",
      "Signals pass across synapses via a relay neurone to a motor neurone.",
      "The motor neurone carries an impulse to an effector muscle, which contracts to withdraw the hand.",
      "The response is automatic; information can also reach the brain, but withdrawal does not wait for a conscious decision."
    ],
    "answer": "Skin receptor → sensory neurone → relay neurone in the spinal cord → motor neurone → effector muscle. The muscle contracts and withdraws the hand without waiting for conscious thought.",
    "notation": false
  },
  "y11-science-homeostasis/practice-1-AQA-Foundation": {
    "question": "A student confuses glucose with glycogen. Explain the difference in the context of insulin’s action after a meal.",
    "hint": "Identify the scientific principle, apply it to the information given and explain your conclusion.",
    "working": [
      "The pancreas releases insulin when blood glucose is high.",
      "Insulin promotes movement of glucose from blood into cells.",
      "It promotes conversion of glucose to glycogen for storage in liver and muscle, helping lower blood glucose."
    ],
    "answer": "The pancreas releases insulin when blood glucose is high. Insulin promotes movement of glucose from blood into cells. It promotes conversion of glucose to glycogen for storage in liver and muscle, helping lower blood glucose.",
    "notation": false
  },
  "y11-science-homeostasis/practice-1-Edexcel-Foundation": {
    "question": "Blood glucose rises after a meal. Explain how insulin helps correct the rise.",
    "hint": "Identify the scientific principle, apply it to the information given and explain your conclusion.",
    "working": [
      "The pancreas releases insulin when blood glucose is high.",
      "Insulin promotes movement of glucose from blood into cells.",
      "It promotes conversion of glucose to glycogen for storage in liver and muscle, helping lower blood glucose."
    ],
    "answer": "The pancreas releases insulin when blood glucose is high. Insulin promotes movement of glucose from blood into cells. It promotes conversion of glucose to glycogen for storage in liver and muscle, helping lower blood glucose.",
    "notation": false
  },
  "y11-science-homeostasis/practice-5-Edexcel-Higher": {
    "question": "The following data were collected from a pupil at four hourly time points to illustrate homeostasis in response to a meal. Body temperature (°C) at 08:00 = 36.7, 09:00 = 36.9, 10:00 = 37.0, 11:00 = 37.1. Blood glucose concentration (mmol/L) at the same times: 5.7, 6.4, 5.9, 5.6. Typical fasting blood glucose is about 5.5 mmol/L and normal human body temperature is around 37.0 °C. a) Calculate the average body temperature over the period. b) Describe whether the body temperature stayed close to the stated typical value of 37.0 °C during this period, and explain your reasoning. c) Explain what the glucose readings suggest about insulin regulation maintaining glucose homeostasis.",
    "hint": "Look at the overall change in temperature and the pattern of glucose after the meal to decide about homeostatic control.",
    "working": [
      "Step 1: Sum of body temperatures = 36.7 + 36.9 + 37.0 + 37.1 = 147.7",
      "Step 2: Average body temperature = 147.7 ÷ 4 = 36.925",
      "Step 3: Average body temperature (to 2 d.p.) = 36.93 °C",
      "Step 4: Sum of glucose readings = 5.7 + 6.4 + 5.9 + 5.6 = 23.6",
      "Step 5: Average glucose = 23.6 ÷ 4 = 5.9"
    ],
    "answer": "a) The mean is 147.7 ÷ 4 = 36.925 °C, approximately 36.93 °C. b) Yes: all readings lie close to 37.0 °C, from 36.7 to 37.1 °C. Homeostasis maintains a range, not an absolutely constant number; these data alone cannot establish overall health. c) Glucose rises after the meal and then falls towards its starting level, consistent with regulation that includes insulin action. Insulin was not measured directly.",
    "notation": false
  },
  "y11-science-homeostasis/practice-7-AQA-Foundation": {
    "question": "A student says insulin is produced by the liver. Correct the statement and describe how insulin affects glucose storage.",
    "hint": "Identify the scientific principle, apply it to the information given and explain your conclusion.",
    "working": [
      "The pancreas releases insulin when blood glucose is high.",
      "Insulin promotes movement of glucose from blood into cells.",
      "It promotes conversion of glucose to glycogen for storage in liver and muscle, helping lower blood glucose."
    ],
    "answer": "The pancreas releases insulin when blood glucose is high. Insulin promotes movement of glucose from blood into cells. It promotes conversion of glucose to glycogen for storage in liver and muscle, helping lower blood glucose.",
    "notation": false
  },
  "y11-science-homeostasis/practice-7-Edexcel-Foundation": {
    "question": "A person’s blood glucose rises after eating and later falls towards its usual range. Explain the role of the pancreas and insulin in this change.",
    "hint": "Identify the scientific principle, apply it to the information given and explain your conclusion.",
    "working": [
      "The pancreas releases insulin when blood glucose is high.",
      "Insulin promotes movement of glucose from blood into cells.",
      "It promotes conversion of glucose to glycogen for storage in liver and muscle, helping lower blood glucose."
    ],
    "answer": "The pancreas releases insulin when blood glucose is high. Insulin promotes movement of glucose from blood into cells. It promotes conversion of glucose to glycogen for storage in liver and muscle, helping lower blood glucose.",
    "notation": false
  },
  "y11-science-quantitative/exam-0-AQA-Foundation": {
    "question": "Calculate the relative formula mass of NaCl. Use relative atomic masses Na = 23 and Cl = 35.5. Show how the formula determines the number of each atom.",
    "marks": 3,
    "markScheme": [
      "Count the atoms represented by the formula, including any atoms inside brackets.",
      "Add their relative atomic masses: 23 + 35.5 = 58.5.",
      "Relative formula mass is a relative quantity and has no unit."
    ],
    "answer": "The relative formula mass is 58.5.",
    "notation": false
  },
  "y11-science-quantitative/exam-0-Edexcel-Foundation": {
    "question": "Calculate the relative formula mass of MgO. Use relative atomic masses Mg = 24 and O = 16. Show how the formula determines the number of each atom.",
    "marks": 3,
    "markScheme": [
      "Count the atoms represented by the formula, including any atoms inside brackets.",
      "Add their relative atomic masses: 24 + 16 = 40.",
      "Relative formula mass is a relative quantity and has no unit."
    ],
    "answer": "The relative formula mass is 40.",
    "notation": false
  },
  "y11-science-quantitative/exam-1-Edexcel-Foundation": {
    "question": "A closed system has a total mass of 40 g before a chemical reaction. Nothing enters or leaves, although a gas is formed. Predict its final total mass and explain why gas formation does not change the total.",
    "marks": 3,
    "markScheme": [
      "The final total mass remains 40 g.",
      "Atoms are rearranged, not created or destroyed, during the reaction.",
      "The gas remains part of the closed system and is included in its total mass."
    ],
    "answer": "The final total mass remains 40 g. Atoms are rearranged, not created or destroyed, during the reaction. The gas remains part of the closed system and is included in its total mass.",
    "notation": false
  },
  "y11-science-quantitative/exam-3-AQA-Foundation": {
    "question": "In the balanced equation 2 H2 + O2 → 2 H2O, explain the ratio of hydrogen molecules to oxygen molecules. How many water molecules form when 8 hydrogen molecules react completely with enough oxygen?",
    "marks": 3,
    "markScheme": [
      "The coefficients give a ratio of 2 hydrogen molecules to 1 oxygen molecule.",
      "Eight hydrogen molecules react with 4 oxygen molecules.",
      "They form 8 water molecules, because the hydrogen-to-water molecule ratio is 2 to 2, equivalent to 1 to 1."
    ],
    "answer": "The coefficients give a ratio of 2 hydrogen molecules to 1 oxygen molecule. Eight hydrogen molecules react with 4 oxygen molecules. They form 8 water molecules, because the hydrogen-to-water molecule ratio is 2 to 2, equivalent to 1 to 1.",
    "notation": false
  },
  "y11-science-quantitative/exam-3-Edexcel-Foundation": {
    "question": "In the balanced equation 2 Mg + O2 → 2 MgO, explain what the coefficient 2 before Mg means and check that oxygen atoms balance.",
    "marks": 3,
    "markScheme": [
      "The coefficient 2 represents two magnesium atoms, not a change in the formula of magnesium.",
      "One oxygen molecule on the left contains two oxygen atoms.",
      "Two MgO formula units on the right contain two oxygen atoms, so oxygen balances."
    ],
    "answer": "The coefficient 2 represents two magnesium atoms, not a change in the formula of magnesium. One oxygen molecule on the left contains two oxygen atoms. Two MgO formula units on the right contain two oxygen atoms, so oxygen balances.",
    "notation": false
  },
  "y11-science-quantitative/exam-6-AQA-Foundation": {
    "question": "Calculate the relative formula mass of CaCO3. Use relative atomic masses Ca = 40, C = 12 and O = 16. Show how the formula determines the number of each atom.",
    "marks": 3,
    "markScheme": [
      "Count the atoms represented by the formula, including any atoms inside brackets.",
      "Add their relative atomic masses: 40 + 12 + 3 × 16 = 100.",
      "Relative formula mass is a relative quantity and has no unit."
    ],
    "answer": "The relative formula mass is 100.",
    "notation": false
  },
  "y11-science-quantitative/exam-7-AQA-Foundation": {
    "question": "A closed system has a total mass of 90 g before a chemical reaction. Nothing enters or leaves, although a gas is formed. Predict its final total mass and explain why gas formation does not change the total.",
    "marks": 3,
    "markScheme": [
      "The final total mass remains 90 g.",
      "Atoms are rearranged, not created or destroyed, during the reaction.",
      "The gas remains part of the closed system and is included in its total mass."
    ],
    "answer": "The final total mass remains 90 g. Atoms are rearranged, not created or destroyed, during the reaction. The gas remains part of the closed system and is included in its total mass.",
    "notation": false
  },
  "y11-science-quantitative/exam-9-AQA-Foundation": {
    "question": "In the balanced equation 2 H2 + O2 → 2 H2O, explain the ratio of hydrogen molecules to oxygen molecules. How many water molecules form when 8 hydrogen molecules react completely with enough oxygen?",
    "marks": 3,
    "markScheme": [
      "The coefficients give a ratio of 2 hydrogen molecules to 1 oxygen molecule.",
      "Eight hydrogen molecules react with 4 oxygen molecules.",
      "They form 8 water molecules, because the hydrogen-to-water molecule ratio is 2 to 2, equivalent to 1 to 1."
    ],
    "answer": "The coefficients give a ratio of 2 hydrogen molecules to 1 oxygen molecule. Eight hydrogen molecules react with 4 oxygen molecules. They form 8 water molecules, because the hydrogen-to-water molecule ratio is 2 to 2, equivalent to 1 to 1.",
    "notation": false
  },
  "y11-science-quantitative/exam-9-Edexcel-Foundation": {
    "question": "In the balanced equation 2 Mg + O2 → 2 MgO, explain what the coefficient 2 before Mg means and check that oxygen atoms balance.",
    "marks": 3,
    "markScheme": [
      "The coefficient 2 represents two magnesium atoms, not a change in the formula of magnesium.",
      "One oxygen molecule on the left contains two oxygen atoms.",
      "Two MgO formula units on the right contain two oxygen atoms, so oxygen balances."
    ],
    "answer": "The coefficient 2 represents two magnesium atoms, not a change in the formula of magnesium. One oxygen molecule on the left contains two oxygen atoms. Two MgO formula units on the right contain two oxygen atoms, so oxygen balances.",
    "notation": false
  },
  "y11-science-quantitative/practice-0-Edexcel-Foundation": {
    "question": "Calculate the relative formula mass of Mg(OH)2. Use relative atomic masses Mg = 24, O = 16 and H = 1. Show how the formula determines the number of each atom.",
    "hint": "Identify the scientific principle, apply it to the information given and explain your conclusion.",
    "working": [
      "Count the atoms represented by the formula, including any atoms inside brackets.",
      "Add their relative atomic masses: 24 + 2 × (16 + 1) = 58.",
      "Relative formula mass is a relative quantity and has no unit."
    ],
    "answer": "The relative formula mass is 58.",
    "notation": false
  },
  "y11-science-quantitative/practice-1-AQA-Higher": {
    "question": "Reactants are mixed in a sealed flask. The flask and its contents have a total mass of 110 g before mixing. A gas forms, but nothing enters or leaves the flask. Predict the final total mass and explain your answer.",
    "hint": "Use the information given and explain the scientific reasoning.",
    "working": [
      "The final total mass is 110 g.",
      "Atoms are rearranged in the reaction, not created or destroyed.",
      "The gas remains inside the sealed flask, so all products are included in the measurement."
    ],
    "answer": "The final total mass is 110 g. Atoms are rearranged in the reaction, not created or destroyed. The gas remains inside the sealed flask, so all products are included in the measurement.",
    "notation": false
  },
  "y11-science-quantitative/practice-1-Edexcel-Higher": {
    "question": "Reactants are mixed in a sealed flask. The flask and its contents have a total mass of 115 g before mixing. A gas forms, but nothing enters or leaves the flask. Predict the final total mass and explain your answer.",
    "hint": "Use the information given and explain the scientific reasoning.",
    "working": [
      "The final total mass is 115 g.",
      "Atoms are rearranged in the reaction, not created or destroyed.",
      "The gas remains inside the sealed flask, so all products are included in the measurement."
    ],
    "answer": "The final total mass is 115 g. Atoms are rearranged in the reaction, not created or destroyed. The gas remains inside the sealed flask, so all products are included in the measurement.",
    "notation": false
  },
  "y11-science-quantitative/practice-2-AQA-Higher": {
    "question": "An open flask containing acid and a carbonate has a mass of 52 g. During the reaction carbon dioxide escapes. Its final mass is 49 g. Explain the mass change and whether it contradicts conservation of mass.",
    "hint": "Use the information given and explain the scientific reasoning.",
    "working": [
      "The measured mass falls by 3 g because carbon dioxide leaves the flask.",
      "The escaping gas is part of the products even though the final weighing does not include it.",
      "If the escaped gas were also included, the total mass would still be 52 g; mass is conserved."
    ],
    "answer": "The measured mass falls by 3 g because carbon dioxide leaves the flask. The escaping gas is part of the products even though the final weighing does not include it. If the escaped gas were also included, the total mass would still be 52 g; mass is conserved.",
    "notation": false
  },
  "y11-science-quantitative/practice-2-Edexcel-Higher": {
    "question": "An open flask containing acid and a carbonate has a mass of 53 g. During the reaction carbon dioxide escapes. Its final mass is 51 g. Explain the mass change and whether it contradicts conservation of mass.",
    "hint": "Use the information given and explain the scientific reasoning.",
    "working": [
      "The measured mass falls by 2 g because carbon dioxide leaves the flask.",
      "The escaping gas is part of the products even though the final weighing does not include it.",
      "If the escaped gas were also included, the total mass would still be 53 g; mass is conserved."
    ],
    "answer": "The measured mass falls by 2 g because carbon dioxide leaves the flask. The escaping gas is part of the products even though the final weighing does not include it. If the escaped gas were also included, the total mass would still be 53 g; mass is conserved.",
    "notation": false
  },
  "y11-science-quantitative/practice-3-AQA-Foundation": {
    "question": "In the balanced equation 2 H2 + O2 → 2 H2O, explain the ratio of hydrogen molecules to oxygen molecules. How many water molecules form when 8 hydrogen molecules react completely with enough oxygen?",
    "hint": "Identify the scientific principle, apply it to the information given and explain your conclusion.",
    "working": [
      "The coefficients give a ratio of 2 hydrogen molecules to 1 oxygen molecule.",
      "Eight hydrogen molecules react with 4 oxygen molecules.",
      "They form 8 water molecules, because the hydrogen-to-water molecule ratio is 2 to 2, equivalent to 1 to 1."
    ],
    "answer": "The coefficients give a ratio of 2 hydrogen molecules to 1 oxygen molecule. Eight hydrogen molecules react with 4 oxygen molecules. They form 8 water molecules, because the hydrogen-to-water molecule ratio is 2 to 2, equivalent to 1 to 1.",
    "notation": false
  },
  "y11-science-quantitative/practice-3-Edexcel-Foundation": {
    "question": "In the balanced equation 2 Mg + O2 → 2 MgO, explain what the coefficient 2 before Mg means and check that oxygen atoms balance.",
    "hint": "Identify the scientific principle, apply it to the information given and explain your conclusion.",
    "working": [
      "The coefficient 2 represents two magnesium atoms, not a change in the formula of magnesium.",
      "One oxygen molecule on the left contains two oxygen atoms.",
      "Two MgO formula units on the right contain two oxygen atoms, so oxygen balances."
    ],
    "answer": "The coefficient 2 represents two magnesium atoms, not a change in the formula of magnesium. One oxygen molecule on the left contains two oxygen atoms. Two MgO formula units on the right contain two oxygen atoms, so oxygen balances.",
    "notation": false
  },
  "y11-science-quantitative/practice-4-AQA-Higher": {
    "question": "Reactants are mixed in a sealed flask. The flask and its contents have a total mass of 140 g before mixing. A gas forms, but nothing enters or leaves the flask. Predict the final total mass and explain your answer.",
    "hint": "Use the information given and explain the scientific reasoning.",
    "working": [
      "The final total mass is 140 g.",
      "Atoms are rearranged in the reaction, not created or destroyed.",
      "The gas remains inside the sealed flask, so all products are included in the measurement."
    ],
    "answer": "The final total mass is 140 g. Atoms are rearranged in the reaction, not created or destroyed. The gas remains inside the sealed flask, so all products are included in the measurement.",
    "notation": false
  },
  "y11-science-quantitative/practice-4-Edexcel-Higher": {
    "question": "Reactants are mixed in a sealed flask. The flask and its contents have a total mass of 145 g before mixing. A gas forms, but nothing enters or leaves the flask. Predict the final total mass and explain your answer.",
    "hint": "Use the information given and explain the scientific reasoning.",
    "working": [
      "The final total mass is 145 g.",
      "Atoms are rearranged in the reaction, not created or destroyed.",
      "The gas remains inside the sealed flask, so all products are included in the measurement."
    ],
    "answer": "The final total mass is 145 g. Atoms are rearranged in the reaction, not created or destroyed. The gas remains inside the sealed flask, so all products are included in the measurement.",
    "notation": false
  },
  "y11-science-quantitative/practice-5-AQA-Foundation": {
    "question": "A measurement is recorded as 90.46 g. Round it to three significant figures and explain why it should not be reported with extra invented decimal places.",
    "hint": "Identify the scientific principle, apply it to the information given and explain your conclusion.",
    "working": [
      "The first three significant digits are the two digits before the decimal point and the 4 after it.",
      "The next digit is 6, so the rounded value is 90.5 g.",
      "Extra invented digits would imply more precision than the measurement provides."
    ],
    "answer": "90.5 g to three significant figures.",
    "notation": false
  },
  "y11-science-quantitative/practice-5-AQA-Higher": {
    "question": "An open flask containing acid and a carbonate has a mass of 55 g. During the reaction carbon dioxide escapes. Its final mass is 52 g. Explain the mass change and whether it contradicts conservation of mass.",
    "hint": "Use the information given and explain the scientific reasoning.",
    "working": [
      "The measured mass falls by 3 g because carbon dioxide leaves the flask.",
      "The escaping gas is part of the products even though the final weighing does not include it.",
      "If the escaped gas were also included, the total mass would still be 55 g; mass is conserved."
    ],
    "answer": "The measured mass falls by 3 g because carbon dioxide leaves the flask. The escaping gas is part of the products even though the final weighing does not include it. If the escaped gas were also included, the total mass would still be 55 g; mass is conserved.",
    "notation": false
  },
  "y11-science-quantitative/practice-5-Edexcel-Higher": {
    "question": "An open flask containing acid and a carbonate has a mass of 56 g. During the reaction carbon dioxide escapes. Its final mass is 54 g. Explain the mass change and whether it contradicts conservation of mass.",
    "hint": "Use the information given and explain the scientific reasoning.",
    "working": [
      "The measured mass falls by 2 g because carbon dioxide leaves the flask.",
      "The escaping gas is part of the products even though the final weighing does not include it.",
      "If the escaped gas were also included, the total mass would still be 56 g; mass is conserved."
    ],
    "answer": "The measured mass falls by 2 g because carbon dioxide leaves the flask. The escaping gas is part of the products even though the final weighing does not include it. If the escaped gas were also included, the total mass would still be 56 g; mass is conserved.",
    "notation": false
  },
  "y11-science-quantitative/practice-6-AQA-Foundation": {
    "question": "Calculate the relative formula mass of NaCl. Use relative atomic masses Na = 23 and Cl = 35.5. Show how the formula determines the number of each atom.",
    "hint": "Identify the scientific principle, apply it to the information given and explain your conclusion.",
    "working": [
      "Count the atoms represented by the formula, including any atoms inside brackets.",
      "Add their relative atomic masses: 23 + 35.5 = 58.5.",
      "Relative formula mass is a relative quantity and has no unit."
    ],
    "answer": "The relative formula mass is 58.5.",
    "notation": false
  },
  "y11-science-quantitative/practice-6-Edexcel-Foundation": {
    "question": "Calculate the relative formula mass of MgO. Use relative atomic masses Mg = 24 and O = 16. Show how the formula determines the number of each atom.",
    "hint": "Identify the scientific principle, apply it to the information given and explain your conclusion.",
    "working": [
      "Count the atoms represented by the formula, including any atoms inside brackets.",
      "Add their relative atomic masses: 24 + 16 = 40.",
      "Relative formula mass is a relative quantity and has no unit."
    ],
    "answer": "The relative formula mass is 40.",
    "notation": false
  },
  "y11-science-quantitative/practice-7-AQA-Higher": {
    "question": "Reactants are mixed in a sealed flask. The flask and its contents have a total mass of 170 g before mixing. A gas forms, but nothing enters or leaves the flask. Predict the final total mass and explain your answer.",
    "hint": "Use the information given and explain the scientific reasoning.",
    "working": [
      "The final total mass is 170 g.",
      "Atoms are rearranged in the reaction, not created or destroyed.",
      "The gas remains inside the sealed flask, so all products are included in the measurement."
    ],
    "answer": "The final total mass is 170 g. Atoms are rearranged in the reaction, not created or destroyed. The gas remains inside the sealed flask, so all products are included in the measurement.",
    "notation": false
  },
  "y11-science-quantitative/practice-7-Edexcel-Higher": {
    "question": "Reactants are mixed in a sealed flask. The flask and its contents have a total mass of 175 g before mixing. A gas forms, but nothing enters or leaves the flask. Predict the final total mass and explain your answer.",
    "hint": "Use the information given and explain the scientific reasoning.",
    "working": [
      "The final total mass is 175 g.",
      "Atoms are rearranged in the reaction, not created or destroyed.",
      "The gas remains inside the sealed flask, so all products are included in the measurement."
    ],
    "answer": "The final total mass is 175 g. Atoms are rearranged in the reaction, not created or destroyed. The gas remains inside the sealed flask, so all products are included in the measurement.",
    "notation": false
  },
  "y11-science-quantitative/practice-8-Edexcel-Higher": {
    "question": "An open flask containing acid and a carbonate has a mass of 59 g. During the reaction carbon dioxide escapes. Its final mass is 57 g. Explain the mass change and whether it contradicts conservation of mass.",
    "hint": "Use the information given and explain the scientific reasoning.",
    "working": [
      "The measured mass falls by 2 g because carbon dioxide leaves the flask.",
      "The escaping gas is part of the products even though the final weighing does not include it.",
      "If the escaped gas were also included, the total mass would still be 59 g; mass is conserved."
    ],
    "answer": "The measured mass falls by 2 g because carbon dioxide leaves the flask. The escaping gas is part of the products even though the final weighing does not include it. If the escaped gas were also included, the total mass would still be 59 g; mass is conserved.",
    "notation": false
  },
  "y11-science-quantitative/practice-9-AQA-Foundation": {
    "question": "In the balanced equation 2 H2 + O2 → 2 H2O, explain the ratio of hydrogen molecules to oxygen molecules. How many water molecules form when 8 hydrogen molecules react completely with enough oxygen?",
    "hint": "Identify the scientific principle, apply it to the information given and explain your conclusion.",
    "working": [
      "The coefficients give a ratio of 2 hydrogen molecules to 1 oxygen molecule.",
      "Eight hydrogen molecules react with 4 oxygen molecules.",
      "They form 8 water molecules, because the hydrogen-to-water molecule ratio is 2 to 2, equivalent to 1 to 1."
    ],
    "answer": "The coefficients give a ratio of 2 hydrogen molecules to 1 oxygen molecule. Eight hydrogen molecules react with 4 oxygen molecules. They form 8 water molecules, because the hydrogen-to-water molecule ratio is 2 to 2, equivalent to 1 to 1.",
    "notation": false
  },
  "y11-science-quantitative/practice-9-Edexcel-Foundation": {
    "question": "In the balanced equation 2 Mg + O2 → 2 MgO, explain what the coefficient 2 before Mg means and check that oxygen atoms balance.",
    "hint": "Identify the scientific principle, apply it to the information given and explain your conclusion.",
    "working": [
      "The coefficient 2 represents two magnesium atoms, not a change in the formula of magnesium.",
      "One oxygen molecule on the left contains two oxygen atoms.",
      "Two MgO formula units on the right contain two oxygen atoms, so oxygen balances."
    ],
    "answer": "The coefficient 2 represents two magnesium atoms, not a change in the formula of magnesium. One oxygen molecule on the left contains two oxygen atoms. Two MgO formula units on the right contain two oxygen atoms, so oxygen balances.",
    "notation": false
  },
  "y11-science-rates/exam-0-AQA-Foundation": {
    "question": "A reaction produces 40 cm³ of gas in 20 seconds. Calculate its mean rate in cm³/s. Does this mean the rate was constant throughout?",
    "marks": 3,
    "markScheme": [
      "Mean rate is total gas volume divided by the time interval.",
      "40 ÷ 20 = 2 cm³/s.",
      "This is an average; the rate may have changed during the interval."
    ],
    "answer": "The mean rate is 2 cm³/s. It does not show that the rate stayed constant.",
    "notation": false
  },
  "y11-science-rates/exam-0-Edexcel-Foundation": {
    "question": "A reaction produces 60 cm³ of gas in 30 seconds. Calculate its mean rate in cm³/s. Does this mean the rate was constant throughout?",
    "marks": 3,
    "markScheme": [
      "Mean rate is total gas volume divided by the time interval.",
      "60 ÷ 30 = 2 cm³/s.",
      "This is an average; the rate may have changed during the interval."
    ],
    "answer": "The mean rate is 2 cm³/s. It does not show that the rate stayed constant.",
    "notation": false
  },
  "y11-science-rates/exam-1-Edexcel-Foundation": {
    "question": "A reaction is repeated at a higher temperature with the same reactant concentrations. Use the particle model to explain why its rate increases.",
    "marks": 3,
    "markScheme": [
      "Particles have a higher average kinetic energy and move faster.",
      "Collisions occur more frequently.",
      "A greater proportion of collisions have enough energy to overcome the activation-energy barrier."
    ],
    "answer": "Particles have a higher average kinetic energy and move faster. Collisions occur more frequently. A greater proportion of collisions have enough energy to overcome the activation-energy barrier.",
    "notation": false
  },
  "y11-science-rates/exam-2-AQA-Foundation": {
    "question": "A ⇌ B represents a reversible reaction. Explain the double arrow and what dynamic equilibrium means in a closed system.",
    "marks": 3,
    "markScheme": [
      "The double arrow means A can react to form B and B can react to form A.",
      "At dynamic equilibrium the forward and reverse reactions continue at equal rates.",
      "The amounts remain constant while conditions stay unchanged; the amounts of A and B need not be equal."
    ],
    "answer": "The double arrow means A can react to form B and B can react to form A. At dynamic equilibrium the forward and reverse reactions continue at equal rates. The amounts remain constant while conditions stay unchanged; the amounts of A and B need not be equal.",
    "notation": false
  },
  "y11-science-rates/exam-2-Edexcel-Foundation": {
    "question": "A reversible reaction occurs in a closed system. At dynamic equilibrium, the amounts of reactants and products stay constant. Explain why this does not mean the reactions have stopped or that the amounts must be equal.",
    "marks": 3,
    "markScheme": [
      "The forward and reverse reactions both continue.",
      "Their rates are equal, so each substance is used and formed at matching rates.",
      "Constant amounts need not be equal amounts; equilibrium concerns equal rates."
    ],
    "answer": "The forward and reverse reactions both continue. Their rates are equal, so each substance is used and formed at matching rates. Constant amounts need not be equal amounts; equilibrium concerns equal rates.",
    "notation": false
  },
  "y11-science-rates/exam-4-AQA-Foundation": {
    "question": "The same quantity of a reactant produces 60 cm³ of gas in 30 seconds with a suitable catalyst and in 120 seconds without it. All reactant is used in both cases. Explain the effect on rate, activation energy and final amount of product.",
    "marks": 3,
    "markScheme": [
      "The catalyst increases the rate, so the same amount of gas is produced in less time.",
      "It provides a different pathway with a lower activation energy.",
      "The final amount of product is unchanged because the same amount of reactant is used; the catalyst is not used up overall."
    ],
    "answer": "The catalyst increases the rate, so the same amount of gas is produced in less time. It provides a different pathway with a lower activation energy. The final amount of product is unchanged because the same amount of reactant is used; the catalyst is not used up overall.",
    "notation": false
  },
  "y11-science-rates/exam-6-AQA-Foundation": {
    "question": "A reaction produces 160 cm³ of gas in 80 seconds. Calculate its mean rate in cm³/s. Does this mean the rate was constant throughout?",
    "marks": 3,
    "markScheme": [
      "Mean rate is total gas volume divided by the time interval.",
      "160 ÷ 80 = 2 cm³/s.",
      "This is an average; the rate may have changed during the interval."
    ],
    "answer": "The mean rate is 2 cm³/s. It does not show that the rate stayed constant.",
    "notation": false
  },
  "y11-science-rates/exam-6-Edexcel-Foundation": {
    "question": "A reaction produces 180 cm³ of gas in 90 seconds. Calculate its mean rate in cm³/s. Does this mean the rate was constant throughout?",
    "marks": 3,
    "markScheme": [
      "Mean rate is total gas volume divided by the time interval.",
      "180 ÷ 90 = 2 cm³/s.",
      "This is an average; the rate may have changed during the interval."
    ],
    "answer": "The mean rate is 2 cm³/s. It does not show that the rate stayed constant.",
    "notation": false
  },
  "y11-science-rates/exam-7-AQA-Foundation": {
    "question": "Equal masses of calcium carbonate powder and large chips react separately with excess acid of the same concentration at the same temperature. Use collision theory to explain why the powder reacts faster. Can you predict an exact completion time from this description?",
    "marks": 3,
    "markScheme": [
      "Powder has a larger exposed surface area than large chips of the same mass.",
      "More acid particles can collide with the exposed solid each second, increasing the frequency of successful collisions.",
      "This explains a faster rate but gives insufficient data to calculate an exact completion time."
    ],
    "answer": "Powder has a larger exposed surface area than large chips of the same mass. More acid particles can collide with the exposed solid each second, increasing the frequency of successful collisions. This explains a faster rate but gives insufficient data to calculate an exact completion time.",
    "notation": false
  },
  "y11-science-rates/exam-8-AQA-Foundation": {
    "question": "A ⇌ B represents a reversible reaction. Explain the double arrow and what dynamic equilibrium means in a closed system.",
    "marks": 3,
    "markScheme": [
      "The double arrow means A can react to form B and B can react to form A.",
      "At dynamic equilibrium the forward and reverse reactions continue at equal rates.",
      "The amounts remain constant while conditions stay unchanged; the amounts of A and B need not be equal."
    ],
    "answer": "The double arrow means A can react to form B and B can react to form A. At dynamic equilibrium the forward and reverse reactions continue at equal rates. The amounts remain constant while conditions stay unchanged; the amounts of A and B need not be equal.",
    "notation": false
  },
  "y11-science-rates/practice-0-AQA-Foundation": {
    "question": "A reaction produces 80 cm³ of gas in 40 seconds. Calculate its mean rate in cm³/s. Does this mean the rate was constant throughout?",
    "hint": "Identify the scientific principle, apply it to the information given and explain your conclusion.",
    "working": [
      "Mean rate is total gas volume divided by the time interval.",
      "80 ÷ 40 = 2 cm³/s.",
      "This is an average; the rate may have changed during the interval."
    ],
    "answer": "The mean rate is 2 cm³/s. It does not show that the rate stayed constant.",
    "notation": false
  },
  "y11-science-rates/practice-0-Edexcel-Foundation": {
    "question": "A reaction produces 100 cm³ of gas in 50 seconds. Calculate its mean rate in cm³/s. Does this mean the rate was constant throughout?",
    "hint": "Identify the scientific principle, apply it to the information given and explain your conclusion.",
    "working": [
      "Mean rate is total gas volume divided by the time interval.",
      "100 ÷ 50 = 2 cm³/s.",
      "This is an average; the rate may have changed during the interval."
    ],
    "answer": "The mean rate is 2 cm³/s. It does not show that the rate stayed constant.",
    "notation": false
  },
  "y11-science-rates/practice-1-AQA-Foundation": {
    "question": "Equal masses of calcium carbonate powder and large chips react separately with excess acid of the same concentration at the same temperature. Use collision theory to explain why the powder reacts faster. Can you predict an exact completion time from this description?",
    "hint": "Identify the scientific principle, apply it to the information given and explain your conclusion.",
    "working": [
      "Powder has a larger exposed surface area than large chips of the same mass.",
      "More acid particles can collide with the exposed solid each second, increasing the frequency of successful collisions.",
      "This explains a faster rate but gives insufficient data to calculate an exact completion time."
    ],
    "answer": "Powder has a larger exposed surface area than large chips of the same mass. More acid particles can collide with the exposed solid each second, increasing the frequency of successful collisions. This explains a faster rate but gives insufficient data to calculate an exact completion time.",
    "notation": false
  },
  "y11-science-rates/practice-2-AQA-Higher": {
    "question": "In a closed system a reversible reaction reaches dynamic equilibrium. A student says this means the reaction has stopped. Explain why the student is wrong.",
    "hint": "Use the information given and explain the scientific reasoning.",
    "working": [
      "The forward and reverse reactions continue.",
      "At equilibrium their rates are equal.",
      "The amounts of reactants and products remain constant, but need not be equal."
    ],
    "answer": "The forward and reverse reactions continue. At equilibrium their rates are equal. The amounts of reactants and products remain constant, but need not be equal.",
    "notation": false
  },
  "y11-science-rates/practice-2-Edexcel-Foundation": {
    "question": "A reversible reaction occurs in a closed system. At dynamic equilibrium, the amounts of reactants and products stay constant. Explain why this does not mean the reactions have stopped or that the amounts must be equal.",
    "hint": "Identify the scientific principle, apply it to the information given and explain your conclusion.",
    "working": [
      "The forward and reverse reactions both continue.",
      "Their rates are equal, so each substance is used and formed at matching rates.",
      "Constant amounts need not be equal amounts; equilibrium concerns equal rates."
    ],
    "answer": "The forward and reverse reactions both continue. Their rates are equal, so each substance is used and formed at matching rates. Constant amounts need not be equal amounts; equilibrium concerns equal rates.",
    "notation": false
  },
  "y11-science-rates/practice-2-Edexcel-Higher": {
    "question": "For a reversible reaction, the forward direction transfers energy to the surroundings. Describe the energy change in the reverse direction for the same quantities of substances.",
    "hint": "Use the information given and explain the scientific reasoning.",
    "working": [
      "The forward reaction is exothermic.",
      "The reverse reaction is endothermic and takes in energy from the surroundings.",
      "For the same quantities reacting, the energy taken in equals the energy released in the forward direction."
    ],
    "answer": "The forward reaction is exothermic. The reverse reaction is endothermic and takes in energy from the surroundings. For the same quantities reacting, the energy taken in equals the energy released in the forward direction.",
    "notation": false
  },
  "y11-science-rates/practice-3-Edexcel-Foundation": {
    "question": "Explain how increasing the temperature, increasing the concentration, and increasing the surface area of a solid reactant would affect the rate of reaction between hydrochloric acid (aq) and calcium carbonate (s). Include a brief explanation of why each factor changes the rate.",
    "hint": "Think about how fast particles move, how often they meet, and what happens at a collision.",
    "working": [
      "Step 1: Increasing temperature raises the average kinetic energy of the reacting particles, so more collisions have enough energy to overcome the activation energy, making more collisions successful.",
      "Step 2: Higher acid concentration means more reacting particles in a given volume of solution, so collisions with the calcium carbonate surface occur more frequently.",
      "Step 3: A larger surface area of the solid CaCO3 (for example, crushing it into powder) exposes more particles to collide with HCl, increasing the frequency of successful collisions."
    ],
    "answer": "Increasing temperature increases the particles’ average kinetic energy and the proportion of collisions with enough energy to react, so the reaction is faster. Increasing acid concentration puts more reacting particles in each unit volume, increasing collision frequency at the solid surface. Increasing the calcium carbonate’s surface area exposes more particles to the acid, increasing successful collisions per second. These comparisons assume other relevant conditions remain unchanged.",
    "notation": false
  },
  "y11-science-rates/practice-4-Edexcel-Foundation": {
    "question": "The same quantity of a reactant produces 60 cm³ of gas in 30 seconds with a suitable catalyst and in 120 seconds without it. All reactant is used in both cases. Explain the effect on rate, activation energy and final amount of product.",
    "hint": "Identify the scientific principle, apply it to the information given and explain your conclusion.",
    "working": [
      "The catalyst increases the rate, so the same amount of gas is produced in less time.",
      "It provides a different pathway with a lower activation energy.",
      "The final amount of product is unchanged because the same amount of reactant is used; the catalyst is not used up overall."
    ],
    "answer": "The catalyst increases the rate, so the same amount of gas is produced in less time. It provides a different pathway with a lower activation energy. The final amount of product is unchanged because the same amount of reactant is used; the catalyst is not used up overall.",
    "notation": false
  },
  "y11-science-rates/practice-5-AQA-Higher": {
    "question": "A reversible reaction is shown as A + B ⇌ C + D. Explain the double arrow and identify the reactants in each direction.",
    "hint": "Use the information given and explain the scientific reasoning.",
    "working": [
      "The double arrow means the reaction can proceed in both directions.",
      "A and B react to form C and D in the forward direction.",
      "C and D react to form A and B in the reverse direction."
    ],
    "answer": "The double arrow means the reaction can proceed in both directions. A and B react to form C and D in the forward direction. C and D react to form A and B in the reverse direction.",
    "notation": false
  },
  "y11-science-rates/practice-5-Edexcel-Higher": {
    "question": "A sealed vessel contains reactants and products at dynamic equilibrium. Explain what happens to their amounts over time and whether equal amounts of reactants and products are required.",
    "hint": "Use the information given and explain the scientific reasoning.",
    "working": [
      "The forward and reverse reactions continue at equal rates.",
      "Their amounts remain constant while conditions remain unchanged.",
      "Equal rates do not require equal amounts of reactants and products."
    ],
    "answer": "The forward and reverse reactions continue at equal rates. Their amounts remain constant while conditions remain unchanged. Equal rates do not require equal amounts of reactants and products.",
    "notation": false
  },
  "y11-science-rates/practice-6-Edexcel-Foundation": {
    "question": "A reaction produces 60 cm³ of gas in 30 seconds. Calculate its mean rate in cm³/s. Does this mean the rate was constant throughout?",
    "hint": "Identify the scientific principle, apply it to the information given and explain your conclusion.",
    "working": [
      "Mean rate is total gas volume divided by the time interval.",
      "60 ÷ 30 = 2 cm³/s.",
      "This is an average; the rate may have changed during the interval."
    ],
    "answer": "The mean rate is 2 cm³/s. It does not show that the rate stayed constant.",
    "notation": false
  },
  "y11-science-rates/practice-7-AQA-Foundation": {
    "question": "Equal masses of calcium carbonate powder and large chips react separately with excess acid of the same concentration at the same temperature. Use collision theory to explain why the powder reacts faster. Can you predict an exact completion time from this description?",
    "hint": "Identify the scientific principle, apply it to the information given and explain your conclusion.",
    "working": [
      "Powder has a larger exposed surface area than large chips of the same mass.",
      "More acid particles can collide with the exposed solid each second, increasing the frequency of successful collisions.",
      "This explains a faster rate but gives insufficient data to calculate an exact completion time."
    ],
    "answer": "Powder has a larger exposed surface area than large chips of the same mass. More acid particles can collide with the exposed solid each second, increasing the frequency of successful collisions. This explains a faster rate but gives insufficient data to calculate an exact completion time.",
    "notation": false
  },
  "y11-science-rates/practice-7-Edexcel-Foundation": {
    "question": "A reaction is repeated at a higher temperature with the same reactant concentrations. Use the particle model to explain why its rate increases.",
    "hint": "Identify the scientific principle, apply it to the information given and explain your conclusion.",
    "working": [
      "Particles have a higher average kinetic energy and move faster.",
      "Collisions occur more frequently.",
      "A greater proportion of collisions have enough energy to overcome the activation-energy barrier."
    ],
    "answer": "Particles have a higher average kinetic energy and move faster. Collisions occur more frequently. A greater proportion of collisions have enough energy to overcome the activation-energy barrier.",
    "notation": false
  },
  "y11-science-rates/practice-8-AQA-Foundation": {
    "question": "A ⇌ B represents a reversible reaction. Explain the double arrow and what dynamic equilibrium means in a closed system.",
    "hint": "Identify the scientific principle, apply it to the information given and explain your conclusion.",
    "working": [
      "The double arrow means A can react to form B and B can react to form A.",
      "At dynamic equilibrium the forward and reverse reactions continue at equal rates.",
      "The amounts remain constant while conditions stay unchanged; the amounts of A and B need not be equal."
    ],
    "answer": "The double arrow means A can react to form B and B can react to form A. At dynamic equilibrium the forward and reverse reactions continue at equal rates. The amounts remain constant while conditions stay unchanged; the amounts of A and B need not be equal.",
    "notation": false
  },
  "y11-science-rates/practice-8-AQA-Higher": {
    "question": "Hydrated copper sulfate is blue. Heating it removes water and produces white anhydrous copper sulfate. Adding water restores the blue substance. Explain why this is evidence of a reversible reaction.",
    "hint": "Use the information given and explain the scientific reasoning.",
    "working": [
      "Heating changes hydrated copper sulfate into anhydrous copper sulfate and water.",
      "Adding water changes the anhydrous substance back into hydrated copper sulfate.",
      "The products can react to reform the starting substance, so the reaction is reversible."
    ],
    "answer": "Heating changes hydrated copper sulfate into anhydrous copper sulfate and water. Adding water changes the anhydrous substance back into hydrated copper sulfate. The products can react to reform the starting substance, so the reaction is reversible.",
    "notation": false
  },
  "y11-science-rates/practice-8-Edexcel-Higher": {
    "question": "A student observes that a reversible reaction has constant concentrations. Explain why this observation alone does not mean that particles have stopped reacting.",
    "hint": "Use the information given and explain the scientific reasoning.",
    "working": [
      "In dynamic equilibrium both directions still occur.",
      "Reactants are used and reformed at matching rates.",
      "Concentrations therefore remain constant even while particles react."
    ],
    "answer": "In dynamic equilibrium both directions still occur. Reactants are used and reformed at matching rates. Concentrations therefore remain constant even while particles react.",
    "notation": false
  },
  "y11-science-rates/practice-9-AQA-Foundation": {
    "question": "A student investigates a reaction between marble chips and excess dilute acid. Explain how increasing acid concentration and using smaller chips affect the rate. State one variable to control when comparing chip sizes.",
    "hint": "Identify the scientific principle, apply it to the information given and explain your conclusion.",
    "working": [
      "Higher concentration means more acid particles per unit volume, increasing collision frequency.",
      "Smaller chips have a larger total exposed surface area for the same mass, increasing collision frequency.",
      "Keep temperature constant when comparing chip sizes."
    ],
    "answer": "Higher concentration means more acid particles per unit volume, increasing collision frequency. Smaller chips have a larger total exposed surface area for the same mass, increasing collision frequency. Keep temperature constant when comparing chip sizes.",
    "notation": false
  },
  "y11-science-rates/practice-9-Edexcel-Foundation": {
    "question": "A student investigates a reaction between marble chips and excess dilute acid. Explain how increasing acid concentration and using smaller chips affect the rate. State one variable to control when comparing chip sizes.",
    "hint": "Identify the scientific principle, apply it to the information given and explain your conclusion.",
    "working": [
      "Higher concentration means more acid particles per unit volume, increasing collision frequency.",
      "Smaller chips have a larger total exposed surface area for the same mass, increasing collision frequency.",
      "Keep temperature constant when comparing chip sizes."
    ],
    "answer": "Higher concentration means more acid particles per unit volume, increasing collision frequency. Smaller chips have a larger total exposed surface area for the same mass, increasing collision frequency. Keep temperature constant when comparing chip sizes.",
    "notation": false
  },
  "y11-science-waves/exam-1-Edexcel-Higher": {
    "question": "A wave travels along a rope with frequency 25 Hz and wavelength 8.0 m. (a) Use v = fλ to calculate its speed. (b) The frequency is increased to 40 Hz while wave speed stays the same. Calculate the new wavelength. (c) Explain why the wavelength changes.",
    "marks": 5,
    "markScheme": [
      "Substitutes v = 25 × 8.0.",
      "Calculates speed 200 m/s.",
      "Rearranges to wavelength = speed/frequency.",
      "Calculates 200/40 = 5.0 m.",
      "Explains that at constant speed, higher frequency gives shorter wavelength."
    ],
    "answer": "(a) v = 25 × 8.0 = 200 m/s. (b) λ = 200/40 = 5.0 m. (c) More waves pass each second at the same speed, so successive wave crests must be closer together.",
    "notation": false
  },
  "y11-science-waves/exam-2-AQA-Higher": {
    "question": "A moving-coil loudspeaker has a voice coil attached to a cone. The coil sits in the radial magnetic field in the gap of a permanent magnet. Explain how an alternating current in the coil produces sound. Include the magnetic force, the effect of reversing current, the motion of the cone and energy transfers.",
    "marks": 6,
    "markScheme": [
      "1 mark: a current-carrying wire experiences a force in a magnetic field.",
      "1 mark: the radial field and coil arrangement make these forces act along the coil axis, moving the attached cone forwards or backwards.",
      "1 mark: reversing the current reverses the force direction.",
      "1 mark: an alternating current therefore produces alternating force and vibration of the cone.",
      "1 mark: the cone produces pressure variations in the surrounding air, forming sound waves.",
      "1 mark: electrical energy is transferred mechanically to the cone and air; some energy is dissipated by heating the coil."
    ],
    "answer": "The voice coil carries current in the permanent magnet's radial field. The motor effect produces an axial force on the coil, which moves its attached cone forwards or backwards. When the current reverses, the force reverses. An alternating current therefore makes the coil and cone vibrate, producing compressions and rarefactions in the air that travel as sound waves. Electrical energy is transferred mechanically to the cone and air, with some dissipated by heating the coil. The loudspeaker cone moves back and forth; it is not a rotating motor.",
    "notation": false
  },
  "y11-science-waves/exam-2-Edexcel-Higher": {
    "question": "A moving-coil loudspeaker has a voice coil attached to a cone. The coil sits in the radial magnetic field in the gap of a permanent magnet. Explain how an alternating current in the coil produces sound. Include the magnetic force, the effect of reversing current, the motion of the cone and energy transfers.",
    "marks": 6,
    "markScheme": [
      "1 mark: a current-carrying wire experiences a force in a magnetic field.",
      "1 mark: the radial field and coil arrangement make these forces act along the coil axis, moving the attached cone forwards or backwards.",
      "1 mark: reversing the current reverses the force direction.",
      "1 mark: an alternating current therefore produces alternating force and vibration of the cone.",
      "1 mark: the cone produces pressure variations in the surrounding air, forming sound waves.",
      "1 mark: electrical energy is transferred mechanically to the cone and air; some energy is dissipated by heating the coil."
    ],
    "answer": "The voice coil carries current in the permanent magnet's radial field. The motor effect produces an axial force on the coil, which moves its attached cone forwards or backwards. When the current reverses, the force reverses. An alternating current therefore makes the coil and cone vibrate, producing compressions and rarefactions in the air that travel as sound waves. Electrical energy is transferred mechanically to the cone and air, with some dissipated by heating the coil. The loudspeaker cone moves back and forth; it is not a rotating motor.",
    "notation": false
  },
  "y7-computing-algorithms-and-decomposition/exam-3-core-core": {
    "question": "A small robot is set to collect 5 coins that are lined up in a straight row. The robot starts at the first coin. Collecting a coin takes 2 seconds. After collecting a coin, if there is another coin ahead, it moves to the next coin; moving between adjacent coins takes 1 second. Use abstraction to plan the robot's actions and calculate the total time for all 5 coins to be collected. Write a short algorithm as a list of steps that shows how you model the task using two actions (collect and move) and then show the calculation to find the total time.",
    "marks": 4,
    "markScheme": [
      "Identify the abstraction: model the task as a simple sequence of two actions (collect and move).",
      "Write a loop-like steps: for coin 1 to 5, collect (2 seconds); if not the last coin, move to next coin (1 second).",
      "Compute totals: collection time = 5 × 2 = 10 seconds; moving time = 4 × 1 = 4 seconds; total time = 14 seconds.",
      "State final answer: total time is 14 seconds."
    ],
    "answer": "Collect the first item. Repeat four times: move to the next item, then collect it. There are five collects at 2 seconds each and four moves at 1 second each: 5 × 2 + 4 × 1 = 14 seconds.",
    "notation": false
  },
  "y7-computing-programming-foundations/exam-1-core-core": {
    "question": "The following Python program is used in a quiz app:\n\n```python\nscore = 7\nif score >= 10:\n    message = 'Nice job'\nelse:\n    message = 'Keep practising'\nprint(message)\n```\n\n(a) What is printed with score equal to 7? (b) What is printed if score is changed to 12? (c) What is printed if score is changed to 9?",
    "marks": 3,
    "markScheme": [
      "(a) Keep practising",
      "(b) Nice job",
      "(c) Keep practising"
    ],
    "answer": "(a) Keep practising (b) Nice job (c) Keep practising",
    "notation": false
  },
  "y7-computing-programming-foundations/exam-4-core-core": {
    "question": "This Python program should add the numbers from 0 to 4 and print 10. It has a missing colon and an incorrect range. Rewrite it with both mistakes corrected, keeping the loop indentation correct.\n\n```python\ntotal = 0\nfor i in range(6)\n    total += i\nprint(total)\n```",
    "marks": 4,
    "markScheme": [
      "Add a colon at the end of the for statement (for i in range(6):).",
      "Indent the line inside the loop so total += i is inside the loop.",
      "Move print(total) so it is outside the loop (not indented under the for block).",
      "Change range(6) to range(5) so the loop runs five times (0 to 4) and the total is 10."
    ],
    "answer": "```python\ntotal = 0\nfor i in range(5):\n    total += i\nprint(total)\n```\nThe program prints 10.",
    "notation": false
  },
  "y7-computing-programming-foundations/exam-6-core-core": {
    "question": "This Python program adds 15 minutes to the number entered. What does the final line print if the user enters 42?\n\n```python\nminutes = int(input(\"Enter minutes read today: \"))\ntotal = minutes + 15\nprint(\"Total minutes of reading:\", total)\n```",
    "marks": 2,
    "markScheme": [
      "total is minutes + 15 (so with minutes = 42, total = 57)",
      "printed output is \"Total minutes of reading: 57\""
    ],
    "answer": "Total minutes of reading: 57",
    "notation": false
  },
  "y7-design-technology-user-needs-and-iterative-design/exam-5-core-core": {
    "question": "A Year 7 student designed a fabric pencil case with a zip to use at school. The specification says the pencil case should: - be 18.0 cm long; - be 6.0 cm wide; - be able to hold at least 8 standard pencils; - weigh no more than 90 g; - cost to make no more than £2.00. The finished pencil case has been measured as: - length 18.0 cm; - width 6.0 cm; - capacity to hold 7 standard pencils; - weight 88 g; - materials used to make one pencil case cost £1.80. Evaluate how well the design meets the specification. For each criterion, state whether it is met or not and give a short reason. Then suggest one improvement that could help meet any criterion that is not fully met.",
    "marks": 6,
    "markScheme": [
      "Length meets the 18.0 cm requirement.",
      "Width meets the 6.0 cm requirement.",
      "Capacity fails: seven pencils is fewer than the required eight.",
      "Mass meets the limit: 88 g is no more than 90 g.",
      "Material cost meets the limit: £1.80 is no more than £2.00.",
      "Proposes a plausible capacity improvement, such as changing the internal layout or increasing depth, and says it must be retested against size, mass and cost limits."
    ],
    "answer": "The length, width, mass and material cost meet the specification. Capacity does not: the case holds seven pencils rather than at least eight. A possible improvement is to increase its depth while preserving the specified length and width, or to reduce wasted internal space. Build and test a revised prototype with eight pencils, then recheck mass and cost; the improvement cannot be assumed to meet every limit without testing.",
    "notation": false
  },
  "y7-english-fiction/practice-1-core-core": {
    "question": "Read the following short scene about Sam starting at a new school. From the passage, select two quotations that best show how Sam feels about starting at Oakwood Middle. Explain briefly why each quotation helps you understand his feelings. Sam stood at the gate, listening to the morning buses rumble past. 'I'm not sure I belong here,' he admitted to the empty street. A girl in a bright yellow scarf waved at him from the school gate and called, 'Come on, it'll be fine!' Another boy shrugged, 'If you don't try, you'll never know.' Sam tucked his hands into his pockets and thought, 'Maybe I can be brave today.' A teacher's voice echoed, 'Welcome to Oakwood Middle.' Sam took a breath and stepped forward.",
    "hint": "Look for moments when Sam speaks about belonging or bravery.",
    "working": [
      "The quote 'I'm not sure I belong here,' shows Sam's feeling of doubt about fitting in.",
      "The quote 'Maybe I can be brave today.' shows Sam deciding to act with courage."
    ],
    "answer": "“I’m not sure I belong here” shows Sam’s uncertainty about fitting in at the new school. “Maybe I can be brave today” shows him encouraging himself to act despite his fear; “maybe” suggests his confidence is still tentative.",
    "notation": false
  },
  "y7-english-narrative/exam-7-core-core": {
    "question": "Read the scene below and continue the moment with a 120–180 word paragraph that uses vivid sensory description. In your writing, describe what you can see, hear, smell, touch and taste, and include at least one simile. The scene: \"The market stalls glowed under the fading light. A kettle hissed at the edge of the potter’s stall, and the scent of warm bread, cinnamon, and oranges drifted through the crowded lanes. A child laughed as a balloon bobbed above the crowd, and a copper bell chimed softly from a shop doorway.\"",
    "marks": 4,
    "markScheme": [
      "Uses vivid sensory detail across at least three senses (sight, smell, sound, touch, taste) to create atmosphere.",
      "Includes at least one simile.",
      "Maintains a clear narrative continuation with consistent tense and voice.",
      "Produces a well-structured paragraph of 120–180 words, focused on the market scene."
    ],
    "answer": "Steam drifted from the kettle as the crowd pressed closer, and the air tasted of sugar and smoke. I moved past the stall with the copper pans, the rough wood of the counter warm under my palms. The market hummed like a busy hive: a vendor calling prices, a child whistling, the clink of coins in a tin cup. The bread scent grew stronger, mingling with orange zest and something tangy from the spice stall. My fingers brushed the fruit crate; the surface was rough with dust and a hint of rain on wood. A breeze whisked a thread of cotton from a stall banner across my cheek, and I could feel the cool air on my lashes as the sun sank. A violin started somewhere, shy and bright, and the bells on a door jangled faintly. I smiled at the bustle, feeling the market’s heartbeat as I followed the crowd deeper into the glow of dusk.",
    "notation": false
  },
  "y7-english-narrative/exam-8-core-core": {
    "question": "Read the short narrative below and rewrite it so that it becomes two paragraphs. Each paragraph must begin with a clear topic sentence, and you should vary the length of sentences and use joining words to link ideas. Do not add any new information or change the meaning. Original passage to rewrite: Mia walked into the quiet school yard. The path behind the gym looked different today. She found a small gate that squeaked when she pushed it. Beyond the gate, the air smelled of rain and soil. The trees rustled as she stepped through, and she felt brave. She decided to follow the path even though she was a little scared.",
    "marks": 4,
    "markScheme": [
      "Two paragraphs created from the original passage.",
      "Each paragraph begins with a topic sentence.",
      "Sentences vary in length and include linking words.",
      "Meaning preserved; no new information added."
    ],
    "answer": "The path behind the gym looked different today. Mia walked into the quiet schoolyard and found a small gate. It squeaked when she pushed it.\n\nBeyond the gate, the air smelled of rain and soil. As Mia stepped through, the trees rustled and she felt brave. Although she was a little scared, she decided to follow the path.",
    "notation": false
  },
  "y7-english-nonfiction/exam-4-core-core": {
    "question": "Read this original teaching extract, preserving its heading and paragraph breaks.\n\nProtect Our Local Park\n\nThe park is a place for everyone. It is where children learn to ride bikes, families have picnics, and friends meet after school.\n\nYet rubbish piles up where the bins should be. This makes paths muddy and dangerous for younger children. Who will pick up the next piece of plastic if we do nothing?\n\nWe could organise a monthly litter-pick. We could fund more bins and put up clear signs. We could ask the council for help.\n\nAction is louder than excuses. If we act now, the park can stay clean and safe for everyone.\n\nAnalyse how the writer organises the extract to persuade the reader. Discuss the heading, the movement between paragraphs, the question, the list of actions and the ending.",
    "marks": 5,
    "markScheme": [
      "Identifies the heading as a structural feature and explains how it frames the topic and invites responsibility.",
      "Notes the pattern of paragraph lengths (short opening, problem description, list of actions, closing line) and explains how this pace emphasises key ideas.",
      "Points out the rhetorical question and explains how it engages the reader and prompts personal reflection.",
      "Identifies the list of actions in one paragraph and explains how listing concrete steps makes the plan feel doable.",
      "Explains the overall effect: the structure moves from describing positives to outlining problems and then to clear actions, nudging the reader to share the writer’s viewpoint and to act."
    ],
    "answer": "The heading presents the park as a shared responsibility. The opening describes its benefits, before “Yet” introduces a problem and creates urgency. The question asks readers to consider their own responsibility. The repeated “We could” offers achievable actions and makes collective action seem possible. The final paragraph combines a firm call to act with the positive outcome of keeping the park safe. This moves the reader from appreciation, through concern, towards action.",
    "notation": false
  },
  "y7-english-poetry/practice-2-core-core": {
    "question": "Read the original poem below and answer the question that follows. Evening slips along the lane, the old streetlamp coughs a yellow sigh. Leaves whisper like quiet prayers, and the river wears a silver cloak. A branch shivers, and the houses listen, as if the night itself is listening back. Support an interpretation. What mood does the poem create, and which lines/phrases show this mood? Use at least two pieces of quoted language from the poem as evidence and explain how they contribute to the mood.",
    "hint": "Think about how the language makes you feel as you read it.",
    "working": [
      "Step 1: Look for phrases that describe feelings or atmosphere, such as how things are described as behaving or feeling.",
      "Step 2: Note any personification or metaphor that adds a mood (for example, a lamp “coughing a yellow sigh” or the night “listening back”).",
      "Step 3: Link these language features to the mood you feel while reading (calm, eerie, reflective, etc.).",
      "Step 4: Pick two or more quotes from the poem to support your interpretation and briefly explain what each piece of language suggests.",
      "Step 5: Combine the ideas to state the overall mood the poem creates and name the supporting lines."
    ],
    "answer": "The mood is quiet and slightly eerie. “Leaves whisper like quiet prayers” suggests hushed, reflective sounds through the simile. “The houses listen” personifies the buildings, making the familiar street seem strangely watchful. Other interpretations are valid if supported by the poem’s language.",
    "notation": false
  },
  "y7-english-speaking/exam-7-core-core": {
    "question": "Read the paragraph below. It contains several mistakes in standard English. Rewrite it in full standard English suitable for a Year 7 discussion and presentation. Hi, i think we should talk about our science project. we need to split the work fairly, for example Sam does the research and Emma writes the report. im not sure if everyone has the same idea, but we must decide soon, because the deadline is on friday. also, we shouldnt forget to check our work for spelling and punctuation, this will help with the presentation. what do you all think?",
    "marks": 4,
    "markScheme": [
      "Uses sentence capitals and capitalises I, Sam, Emma and Friday.",
      "Uses full stops or other appropriate punctuation to avoid comma splices.",
      "Corrects missing apostrophes or uses complete forms such as I am and should not.",
      "Keeps the meaning clear in standard English appropriate for a discussion; a conversational greeting is acceptable."
    ],
    "answer": "Hi, I think we should talk about our science project. We need to split the work fairly. For example, Sam could do the research and Emma could write the report. I am not sure whether everyone has the same idea, but we must decide soon because the deadline is on Friday. We should also check our spelling and punctuation; this will help with the presentation. What do you all think?",
    "notation": false
  },
  "y7-geography-britain-s-physical-landscapes/exam-7-core-core": {
    "question": "Question 8. Read the description of a small relief map used in Britain's Physical Landscapes for Year 7. The map uses a contour interval of 20 metres and shows two areas, A and B, on the same map. In Area A, the distance on the map between two consecutive contour lines is 0.5 cm. In Area B, the distance between two consecutive contour lines is 5 cm. The map scale is 1 cm represents 200 metres in real life. The contour lines shown are 60 m, 80 m and 100 m in Area A, and 60 m, 80 m, 100 m and 120 m in Area B. 8a) Which area has the steeper slope, A or B? Explain your answer using the spacing of the contour lines. 8b) Calculate the gradient of Area A in the form rise:run and as a percentage. Show your working. 8c) Calculate the gradient of Area B in the form rise:run and as a percentage. Show your working.",
    "marks": 4,
    "markScheme": [
      "Identifies Area A as steeper.",
      "Explains that closer contours mean the same rise occurs over less horizontal distance.",
      "For Area A: rise:run = 20 m : 100 m; gradient = 20/100 = 0.20, which is 20% (also 1:5).",
      "For Area B: rise:run = 20 m : 1000 m; gradient = 20/1000 = 0.02, which is 2% (also 1:50)."
    ],
    "answer": "Area A has the steeper slope because its contour lines are much closer together (0.5 cm apart) than Area B’s (5 cm apart). Area A gradient: rise:run = 20 m:100 m; gradient = 0.20 (20%); equivalent to 1:5. Area B gradient: rise:run = 20 m:1000 m; gradient = 0.02 (2%); equivalent to 1:50.",
    "notation": false
  },
  "y7-geography-britain-s-physical-landscapes/practice-2-core-core": {
    "question": "Explain how a river valley in Britain’s physical landscape is formed. In your answer, describe two processes that deepen and widen the valley. Use the data in the question to calculate how deep the valley floor becomes after 280 years: in a simplified constant-rate model, the river erodes the valley floor at a rate of 0.25 cm per year.",
    "hint": "Think about how the river wears away rock as it flows and how weathering helps to break rock on the valley sides.",
    "working": [
      "Vertical erosion, for example abrasion by transported stones, wears down the river bed.",
      "Weathering loosens material on valley sides; movement downslope and removal by the river help widen the valley.",
      "At the assumed constant rate, 0.25 × 280 = 70 cm = 0.70 m."
    ],
    "answer": "Abrasion by stones carried in the river can erode the bed and deepen the valley. Weathering breaks rock on the sides, and downslope movement followed by removal of debris helps widen it. Under the simplified constant-rate assumption, the floor becomes 70 cm, or 0.70 m, deeper after 280 years. Real erosion rates vary.",
    "notation": false
  },
  "y7-geography-earthquakes-and-volcanoes/practice-8-core-core": {
    "question": "These are fictional teaching scenarios. Compare how two communities respond to disasters: Alderby City hit by an earthquake and Cragstone Town affected by a volcanic eruption. In Alderby City the earthquake at 07:20 caused power cuts to about 1,900 homes and damaged main roads. Ten emergency teams arrived by 07:45. By 09:15, about 450 people had taken shelter in the local sports hall, and local schools were closed for 2 days. In Cragstone Town, the volcanic eruption at 06:50 sent an ash plume up to 6 km high, and an evacuation order was issued for 2,500 residents. Within 3 hours, 8 evacuation buses and 3 boats were used to move people to shelters in the town hall and the community centre. Air quality monitors showed safe levels again after 24 hours. Compare how the two communities responded, focusing on speed, organisation, and the impact on daily life.",
    "hint": "Think about how quickly help started, how the two responses organised people and transport, and how daily life changed (like school closures and air quality).",
    "working": [
      "Compare equivalent response milestones where the information allows it.",
      "In Alderby, teams arrived 25 minutes after the earthquake and 450 people were sheltered by 09:15. In Cragstone, buses and boats moved people within three hours; the exact time the evacuation order was issued is not given.",
      "Both communities organised shelters. Cragstone used buses and boats, while Alderby deployed emergency teams.",
      "Alderby had power cuts and two days of school closure. Cragstone had evacuation and unsafe air before readings improved after 24 hours. These different measures do not establish which community recovered sooner."
    ],
    "answer": "Both communities organised help and shelter using different resources. Alderby’s teams arrived within 25 minutes; Cragstone used buses and boats within three hours. These are different milestones, so the information does not establish which evacuation was faster. Both experienced disruption, but school closures and air-quality readings do not directly measure the same aspect of recovery.",
    "notation": false
  },
  "y7-geography-west-africa-a-regional-study/exam-0-core-core": {
    "question": "West Africa is in the western part of Africa, with countries including Senegal in the west and Nigeria farther east. The region includes Atlantic coasts, tropical forests in some wetter areas, savanna and drier northern areas. The Niger is one of its major rivers. Locate the region and describe three of these physical features.",
    "marks": 4,
    "markScheme": [
      "Locates the region in western Africa, including an Atlantic coastline.",
      "Describes tropical forests in wetter parts of the region, with substantial rainfall and dense vegetation.",
      "Describes savanna as grassland with scattered trees and seasonal rainfall.",
      "Describes the Niger as a major river flowing through several West African countries towards the Gulf of Guinea."
    ],
    "answer": "West Africa lies in western Africa and includes an Atlantic coastline. Wetter parts have tropical forests with dense vegetation. Savanna areas have grasses, scattered trees and seasonal rainfall. The Niger is a major river crossing several countries before reaching the Gulf of Guinea. Conditions vary across the region.",
    "notation": false
  },
  "y7-geography-west-africa-a-regional-study/exam-3-core-core": {
    "question": "The following are fictional teaching case studies set in West Africa, not statistics about real settlements. Two places are described below. Read the information and answer. Ninso is a fictional rural village in Ghana. Population: 1,400 Main jobs: farming (90% of working people) Water: clean water available to 60% of households; rest fetch water from river or wells Electricity: 15% of households have electricity Education: 1 primary school with about 120 pupils Health: 1 small clinic run by a nurse Porto is a fictional urban settlement in Nigeria. Population: 2,000,000 Main jobs: services and trading; many work in shops, offices or factories Water: 85% of households have piped clean water Electricity: 95% of households have electricity Education: 40 primary schools and 15 secondary schools Health: 5 hospitals and many clinics Using these details, compare Ninso and Porto in terms of population, access to water and electricity, education, and health services. Identify two differences and one similarity.",
    "marks": 4,
    "markScheme": [
      "Population size is much larger in Porto than in Ninso.",
      "Access to water and electricity is much higher in Porto than in Ninso.",
      "There is a similarity: both places have education and health provisions (Ninso has a primary school and a clinic; Porto has many primary/secondary schools and hospitals).",
      "Porto has far more schools and hospitals than Ninso."
    ],
    "answer": "Porto has a population of about 2,000,000, while Ninso has about 1,400 people. Porto has much higher access to water (85% vs 60%) and electricity (95% vs 15%). Education and health facilities are far more extensive in Porto (40 primary schools and 15 secondary schools; 5 hospitals) than in Ninso (1 primary school with ~120 pupils and 1 small clinic). A similarity is that both places have some form of education and health provision for residents (Ninso with a primary school and a clinic; Porto with many schools and hospitals).",
    "notation": false
  },
  "y7-history-local-history-investigation/practice-8-core-core": {
    "question": "Local History Investigation – Reach a supported conclusion. You are studying why the town clock in your local area stopped on a particular day in May 1949. You have two fictional teaching sources: Source A (a diary entry by a shopkeeper dated 3 May 1949): \"The town clock paused for a long moment at three in the afternoon, then began to tick again as normal.\" Source B (a local newspaper published on 4 May 1949): \"The town clock stopped for several hours in the mid-afternoon today, but resumed by 6 pm. Repairs were carried out early this morning.\" Using these sources, assess whether the sources establish a mechanical fault or a power cut. Give a short, supported conclusion.",
    "hint": "Check dates, wording and disagreement before deciding what the evidence can support.",
    "working": [
      "Source A describes a short pause on 3 May; Source B, dated 4 May, says “today” and describes a longer stoppage. They may concern different events.",
      "Source B places repairs early that morning, not necessarily after the reported afternoon stoppage.",
      "Repairs do not identify the fault; neither source directly states a mechanical cause or a power cut."
    ],
    "answer": "The cause cannot be established from these sources. Their dates and reported durations differ, and only Source B mentions repairs. Those repairs could concern several problems and are described as occurring before the afternoon stoppage. I would seek maintenance records, information about the clock mechanism and evidence of power interruptions before choosing between the explanations.",
    "notation": false
  },
  "y7-maths-geometry/practice-8-core-core": {
    "question": "Question 9: A rectangle of $8$ cm by $5$ cm has a square of $2$ cm by $2$ cm removed from the bottom-right corner. Calculate the perimeter and the area of the resulting shape.",
    "hint": "Subtract the area of the missing square for area, and add up the outer edges for the perimeter.",
    "working": [
      "Area of full rectangle = $8 \\times 5 = 40$ cm$^2$.",
      "Area of missing square = $2 \\times 2 = 4$ cm$^2$.",
      "Area of shape = $40 - 4 = 36$ cm$^2$.",
      "Perimeter components: top edge length = 8 cm.",
      "Down the right edge to the notch start: length = 5 − 2 = 3 cm.",
      "Across the top of the missing square: length = 2 cm.",
      "Down the inner edge of the notch: length = 2 cm.",
      "Along bottom edge from notch to left corner: length = 6 cm.",
      "Up left edge to starting point: length = 5 cm.",
      "Total perimeter = $8 + 3 + 2 + 2 + 6 + 5 = 26$ cm."
    ],
    "answer": "Perimeter = 26 cm; Area = 36 cm$^2$.",
    "notation": true
  },
  "y7-maths-number/exam-4-core-core": {
    "question": "All prices are in pounds. At a tuck shop, a hot chocolate costs $1.20$ and a marshmallow bar costs $0.80$. You buy $3$ hot chocolates and $2$ marshmallow bars. You pay with a $10.00$ note. How much change do you get? If you split the change equally between two friends, how much does each friend receive?",
    "marks": 5,
    "markScheme": [
      "$3 \\times 1.20 = 3.60$",
      "$2 \\times 0.80 = 1.60$",
      "$3.60 + 1.60 = 5.20$",
      "$10.00 - 5.20 = 4.80$",
      "$4.80 \\div 2 = 2.40$"
    ],
    "answer": "The change is £4.80. Split equally between two friends, each receives £2.40.",
    "notation": true
  },
  "y7-science-acids/exam-8-core-core": {
    "question": "A mixture contains insoluble sand and table salt dissolved in water. In a supervised school practical, how would you separate the sand and recover salt from the solution? Give the techniques in order and explain why each works.",
    "marks": 3,
    "markScheme": [
      "Filtration to separate the insoluble sand from the liquid (sand is insoluble in water).",
      "Evaporation to recover the dissolved salt from the filtrate (salt dissolves in water; removing water leaves salt crystals).",
      "The order is important: filtration first to remove the solid sand, then evaporation to obtain dry salt from the salt-water solution."
    ],
    "answer": "First filter the mixture: insoluble sand stays on the filter paper while salt solution passes through. Gently evaporate some water from the filtrate and allow salt to crystallise, then separate and dry the crystals. Follow the teacher’s instructions for heating and do not boil the solution vigorously.",
    "notation": false
  },
  "y7-science-acids/practice-4-core-core": {
    "question": "In a simple experiment, hydrochloric acid (HCl) reacts with sodium hydroxide (NaOH) and forms a salt and water. Explain what neutralisation means in this reaction and name the two products formed.",
    "hint": "Think about what happens when an acid meets an alkali.",
    "working": [
      "Neutralisation is the reaction of an acid with a base; here the base is the alkali sodium hydroxide.",
      "Hydrochloric acid and sodium hydroxide produce sodium chloride and water.",
      "If either reactant is supplied in excess, some remains after the other is used up."
    ],
    "answer": "Hydrochloric acid reacts with sodium hydroxide in a neutralisation reaction. The products are sodium chloride and water. A neutral final solution requires appropriate reacting amounts; an excess of acid or alkali would remain acidic or alkaline.",
    "notation": false
  },
  "y7-science-cells/exam-3-core-core": {
    "question": "An image of a plant cell viewed under a light microscope is magnified 400×. The length of the cell image on the screen is 2.0 cm. Using that 1 cm = 10,000 μm, calculate the actual length of the cell in micrometres (μm).",
    "marks": 3,
    "markScheme": [
      "Uses actual length = image length/magnification.",
      "Calculates 2.0/400 = 0.005 cm.",
      "Converts 0.005 × 10,000 = 50 μm."
    ],
    "answer": "Actual length = 2.0 cm ÷ 400 = 0.005 cm = 50 μm.",
    "notation": false
  },
  "y7-science-cells/exam-8-core-core": {
    "question": "A plant leaf is an organ that helps the plant capture sunlight. The leaf contains different tissues, including epidermal tissue and mesophyll tissue. Each tissue is made from many cells. Using this information, explain how cells, tissues and organs are connected in the leaf.",
    "marks": 4,
    "markScheme": [
      "A tissue is a group of similar cells working together on a function.",
      "An organ contains different tissues working together.",
      "The leaf is an organ containing tissues such as epidermal and mesophyll tissue.",
      "Those tissues contribute different functions, such as protection and photosynthesis, to the work of the leaf."
    ],
    "answer": "Similar cells work together to form tissues. Different tissues work together in an organ. A leaf is an organ: its epidermal tissue helps protect it, while mesophyll tissue carries out much of its photosynthesis.",
    "notation": false
  },
  "y7-science-cells/practice-6-core-core": {
    "question": "Compare a typical photosynthetic plant leaf cell with a typical animal cell. Describe two structural differences and explain how the plant structures help it function.",
    "hint": "Think about why a plant needs to stay upright and how it makes its own food.",
    "working": [
      "The photosynthetic leaf cell has chloroplasts, which absorb light for photosynthesis; the animal cell does not.",
      "The plant cell has a cellulose wall that supports the cell and resists excessive expansion; the animal cell lacks this wall."
    ],
    "answer": "The leaf cell has chloroplasts for photosynthesis, unlike the animal cell. It also has a cellulose cell wall that provides support and resists excessive expansion as water enters. Animal cells do not have a cellulose wall. Not every plant cell has chloroplasts.",
    "notation": false
  },
  "y7-science-enquiry/practice-8-core-core": {
    "question": "In a Year 7 science investigation, you test how the amount of sugar in a solution affects the growth of cress seeds after one week. You record the final height of the sprouts in cm for four sugar levels: 0% sugar – 3.0 cm; 0.5% sugar – 3.5 cm; 1.0% sugar – 4.0 cm; 2.0% sugar – 3.5 cm. To present these results clearly to someone else, which method would you choose and why?",
    "hint": "Think about a format that makes the two quantities easy to compare at a glance.",
    "working": [
      "Step 1: Decide a suitable method for clear comparison of two quantities (sugar level and height) — a table.",
      "Step 2: Describe the table structure and fill in the data: Columns \"Sugar concentration (%)\" and \"Height (cm)\"; rows for 0, 0.5, 1.0, 2.0 with heights 3.0, 3.5, 4.0, 3.5 respectively."
    ],
    "answer": "A table with two columns: \"Sugar concentration (%)\" and \"Height (cm)\"; rows: 0% → 3.0 cm, 0.5% → 3.5 cm, 1.0% → 4.0 cm, 2.0% → 3.5 cm. A table makes each precise value easy to read and shows the units in the headings. A graph with sugar concentration on a numerical horizontal axis and height on the vertical axis would also help show the pattern; the concentrations must be spaced according to their values.",
    "notation": false
  },
  "y7-science-forces/practice-9-core-core": {
    "question": "A pupil briefly pushes a wooden block to the right across a horizontal desk, then removes their hand. The block continues moving right but slows down. Identify the forces on it after the hand is removed. You may ignore air resistance.",
    "hint": "The hand no longer touches the block. Distinguish its direction of motion from the direction of the resultant force.",
    "working": [
      "Weight acts downwards.",
      "The desk exerts an upward normal contact force.",
      "Friction acts to the left, opposing the sliding motion.",
      "There is no continuing push from the hand. The resultant horizontal force is leftwards, so the rightward motion slows."
    ],
    "answer": "Weight acts down, the normal contact force acts up and friction acts left. There is no applied push after the hand has been removed.",
    "notation": false
  },
  "y7-science-particles/exam-5-core-core": {
    "question": "A beaker contains 200 g of ice at -6°C. It is heated gently and the temperature of the contents is recorded every minute for 9 minutes. The readings are: 0 min -6°C; 1 min -5°C; 2 min -2°C; 3 min 0°C; 4 min 0°C; 5 min 0°C; 6 min 2°C; 7 min 6°C; 8 min 12°C; 9 min 16°C. Use this information to interpret the heating curve and answer the following: a) Identify the time period when melting occurs. b) Explain why the temperature stays at 0°C during melting. c) Describe how the temperature changes before melting and after melting.",
    "marks": 3,
    "markScheme": [
      "1 mark: identifies the observed plateau at 0°C from 3 to 5 minutes as the melting interval.",
      "1 mark: explains that supplied energy changes the arrangement/separation of particles rather than increasing temperature during melting.",
      "1 mark: describes warming from -6°C to 0°C before the plateau and from 0°C at 5 minutes to 16°C at 9 minutes afterwards; exact completion time lies between readings."
    ],
    "answer": "(a) The readings show a 0°C plateau from 3 to 5 minutes, indicating melting; it has finished by the 6-minute reading. (b) Energy overcomes some attractions between water molecules so the solid structure can change, rather than raising temperature. The water molecules themselves are not split apart. (c) Ice warms from -6°C to 0°C during 0–3 minutes. After the plateau, the temperature rises from 0°C at 5 minutes to 16°C at 9 minutes. The exact moment melting ends cannot be located between the one-minute readings.",
    "notation": false
  },
  "y8-computing-modular-programs/practice-8-core-core": {
    "question": "In a small modular program used in this unit, there are three modules: readQuantity(), computeCost(quantity), displayResult(cost). The computeCost module is meant to calculate total cost by cost = quantity × pricePerApple, where pricePerApple = £0.50. In the current program pricePerApple has been set to £0.60 by mistake. When a customer orders 8 apples, the program prints £4.80. You are asked to: (a) suggest two simple tests you would run to find the bug, and (b) explain how to fix it and show the correct total for 8 apples using the corrected price.",
    "hint": "Check the value used for pricePerApple in the cost module.",
    "working": [
      "Test quantity 1: expect £0.50, but the faulty program gives £0.60.",
      "Test quantity 8: expect £4.00, but the faulty program gives £4.80.",
      "Both discrepancies point to the unit price in computeCost. Set pricePerApple to 0.50.",
      "Repeat both tests after the correction and check that displayResult formats the amounts as currency."
    ],
    "answer": "Test 1 apple (expected £0.50) and 8 apples (expected £4.00). The faulty outputs are £0.60 and £4.80. Change pricePerApple from 0.60 to 0.50 and rerun the tests. The corrected total for eight apples is £4.00.",
    "notation": false
  },
  "y8-design-technology-electronic-systems/practice-8-core-core": {
    "question": "In a simple series circuit, a 9 V battery is connected to a 330 Ω resistor and an LED. The LED has a forward voltage drop of 2.0 V. A switch is used to connect or disconnect the circuit. When the switch is turned on, calculate the current flowing through the circuit. If the resistor is replaced with 1 kΩ, estimate the current. Explain why the current alone does not tell you its exact brightness or whether either current is within its safe rating. Use I = (V_battery - V_LED) / R for each case.",
    "hint": "Subtract the LED’s forward voltage from the supply, then apply Ohm’s law.",
    "working": [
      "Using the supplied constant-drop model, the resistor has 9.0 − 2.0 = 7.0 V across it.",
      "With 330 Ω, I = 7/330 = 0.0212 A, approximately 21.2 mA.",
      "With 1000 Ω, I = 7/1000 = 0.0070 A = 7.0 mA.",
      "The lower current would normally make this LED dimmer. There is no stated 10 mA on/off threshold.",
      "Check the LED datasheet for safe current and light-output information; the simple voltage-drop model is an estimate."
    ],
    "answer": "The estimated currents are 21.2 mA and 7.0 mA. The LED may still emit light at 7.0 mA. Its brightness and safe operating limits require component data.",
    "notation": false
  },
  "y8-design-technology-motion-and-mechanisms/practice-3-core-core": {
    "question": "Compare motion types used by two parts in a simple design: Part A uses wheels ; the wheels rotate 80 times and, as a result, the toy car moves forward by 12.5 cm each full rotation. Part B has a windscreen wiper that moves a blade along a straight guide and sweeps a distance of 25.0 cm from one end of the guide to the other in one sweep. Identify the motion type for Part A and for Part B; calculate how far the car travels after 80 wheel rotations; and state one advantage of rotary motion (as used by the wheels) and one advantage of linear motion (as used by the wiper).",
    "hint": "Remember that rotary motion comes from turning around a centre, while linear motion goes in a straight line.",
    "working": [
      "Step 1: Distance moved per full wheel rotation = 12.5 cm.",
      "Step 2: Distance travelled after 80 rotations = 12.5 cm × 80 = 1000 cm.",
      "Step 3: Convert to metres: 1000 cm = 10.0 m.",
      "The wheels turn about an axis: rotary motion. The guided blade travels along a straight line: linear motion.",
      "Rotary motion allows continuous rolling; the straight guide controls the blade along a predictable path."
    ],
    "answer": "Part A uses rotary wheel motion; Part B uses linear blade motion. Using the stated 12.5 cm per rotation, the car travels 80 × 12.5 = 1000 cm = 10.0 m. Rotary motion allows continuous rolling, while a linear guide constrains the blade to a straight path.",
    "notation": false
  },
  "y8-design-technology-sustainable-cad-cam/practice-7-core-core": {
    "question": "Name two CAM processes and explain how software uses a CAD model to guide a machine. Describe two ways a planned CAM job can reduce waste or energy use, giving examples. For any school workshop job, material and machine suitability must be checked by the teacher.",
    "hint": "Think about how CAM plans the machine's path and how arranging several parts on one sheet can cut wasted material and time.",
    "working": [
      "Step 1: CAM uses the CAD drawing to generate a toolpath that tells the machine where to cut, mill, or print.",
      "Step 2: Nesting means placing several parts on one sheet so more of the material is used and scrap is reduced.",
      "Step 3: CAM can adjust the machine’s settings (like speed and other controls) to work efficiently and use less energy.",
      "Step 4: A well-planned CAM job reduces mistakes and waste, helping the project be more sustainable."
    ],
    "answer": "CNC milling and 3D printing are CAM processes. Software converts a CAD model into instructions or toolpaths for the machine. For cutting sheet material, nesting shapes closely can reduce offcuts. Planning shorter tool movements or avoiding failed jobs can reduce machine time and energy use. These savings depend on the process and settings; CAM is not automatically more sustainable.",
    "notation": false
  },
  "y8-design-technology-textiles-and-modern-materials/practice-1-core-core": {
    "question": "Two fabric rectangles are each 16.0 cm wide and 9.0 cm tall. Join their 9.0 cm edges with one straight seam, using a 0.5 cm seam allowance on each piece. Then turn down the top long edge by 2.0 cm and stitch one straight hem across the full joined width. Ignore backstitching and any extra side finishing. What total length of stitching is needed?",
    "hint": "The two seam allowances reduce the joined width by 1.0 cm.",
    "working": [
      "The joining seam is 9.0 cm long.",
      "The finished joined width is 16.0 + 16.0 − 0.5 − 0.5 = 31.0 cm.",
      "The hem runs across that width, so its stitching is 31.0 cm long.",
      "Total stitching is 9.0 + 31.0 = 40.0 cm."
    ],
    "answer": "40.0 cm of stitching: a 9.0 cm seam and a 31.0 cm hem.",
    "notation": false
  },
  "y8-design-technology-textiles-and-modern-materials/practice-6-core-core": {
    "question": "Use the following sample test results, not a claim about every cotton or polyester fabric. Two fabrics for a Summer T-shirt are compared: Fabric A is 100% cotton and Fabric B is 100% polyester. For every 100 g of fabric, Fabric A absorbs 7 g of water and Fabric B absorbs 0.5 g. When left in the sun to dry, Fabric A takes 60 minutes to dry completely and Fabric B takes 25 minutes. Breathability is described as High for cotton and Low for polyester. Compare the material properties of these two fabrics in terms of comfort in hot weather and ease of washing/drying. Which fabric would you choose for a T-shirt worn in hot weather if you want it to feel cool and dry quickly? Explain using the data above.",
    "hint": "Think about how much water each fabric holds and how quickly it dries.",
    "working": [
      "Step 1: Cotton absorbs 7 g of water per 100 g of fabric; polyester absorbs 0.5 g per 100 g. Cotton thus holds more water when wet.",
      "Step 2: Drying times are 60 minutes for cotton and 25 minutes for polyester; polyester dries faster.",
      "Step 3: Breathability is High for cotton and Low for polyester; higher breathability helps a fabric feel cooler in hot weather.",
      "Step 4: There is a trade-off: cotton feels cooler but dries slowly, while polyester dries quickly but may not feel as cool. For a hot-weather T-shirt, cotton is better for a cool feel; polyester is better for quick drying."
    ],
    "answer": "I would choose Fabric A if feeling cool is the main priority, because its stated breathability is High rather than Low. The trade-off is drying time: it takes 60 minutes, compared with 25 for B, and absorbs 7 g of water per 100 g rather than 0.5 g. If rapid drying matters more, B is the stronger choice from these data. No single sample is best on both measures, and absorbency alone does not prove comfort. Try garments with users before making the final choice.",
    "notation": false
  },
  "y8-english-accuracy/exam-6-core-core": {
    "question": "Classify each numbered sentence as simple, compound or complex. For this task, classify by finite clauses: a simple sentence has one main clause; a compound sentence has coordinated main clauses; a complex sentence has a main clause and a subordinate clause.\n1. Morning light spilled over the river.\n2. The rain had stopped, and the path glittered.\n3. I slowed down.\n4. A girl waved from the bus stop.\n5. I waved back, but she had turned away.\n6. She smiled when she saw me.\n7. When I reached the gates, the school looked welcoming.\nThen rewrite one simple sentence with an opening phrase of no more than two words and explain its effect on the rhythm.",
    "marks": 5,
    "markScheme": [
      "Simple: 1, 3 and 4.",
      "Compound: 2 and 5.",
      "Complex: 6 and 7.",
      "Provides a grammatical revision beginning with a phrase of one or two words.",
      "Explains a plausible rhythmic effect of that revision."
    ],
    "answer": "Simple: 1, 3 and 4. Compound: 2 and 5. Complex: 6 and 7. One revision is “Very slowly, I slowed down.” The opening phrase and comma delay the main action, producing a pause that can emphasise the narrator’s hesitation. Other grammatical revisions and supported effects are acceptable.",
    "notation": false
  },
  "y8-english-argument/practice-3-core-core": {
    "question": "Read the following situation: In your town, the local council is deciding whether to replace the old community park with a small shopping centre. The proposed centre would have a café and eight small shops. The park currently has a grassy area, a wooden bench, and a winding path where children ride bikes after school. Some residents say the shops will create jobs for teenagers and attract visitors to the town. Others say losing the park would make the town feel less friendly and would remove a safe place for families to play and relax. Develop a clear viewpoint for or against the proposal. Write a short speech or article of about 180–200 words arguing your chosen side. Include at least two reasons with simple examples from everyday life, and finish with a short conclusion. Begin with a clear statement of your view.",
    "hint": "Think about which outcome you want most and what the other side would argue.",
    "working": [
      "Step 1 - Decide your stance (for or against) and state it clearly at the start of your writing.",
      "Step 2 - Choose two reasons from the scenario that support your stance and think of a simple example for each.",
      "Step 3 - Plan a short four‑paragraph structure: opening statement of your view, paragraph for Reason 1 with example, paragraph for Reason 2 with example, a brief counter‑argument and rebuttal, and a concluding sentence."
    ],
    "answer": "I am against replacing our community park with a shopping centre. Although new shops could bring useful jobs, the council should protect a place that serves residents every day.\n\nFirst, the park gives children a free space to exercise. After school, they can ride bikes along the winding path or play on the grass. Families do not need to buy anything to enjoy these activities. Losing that space would make healthy recreation harder for people without gardens.\n\nSecond, the park helps neighbours meet. Someone resting on the bench can talk to a friend, while families gather nearby. These ordinary meetings build relationships between people who might otherwise rarely speak. A shopping centre would offer somewhere to visit, but its main purpose would be selling goods.\n\nSupporters rightly point out that teenagers need employment. The council should therefore investigate whether empty premises elsewhere could provide shop space. That possibility needs evidence about costs and demand; it cannot simply be assumed. Nevertheless, the park already provides a clear public benefit. I would keep it and explore other locations for new businesses.",
    "notation": false
  },
  "y8-english-comparison/exam-6-core-core": {
    "question": "Read Text A and Text B below. Text A is a diary-style reflection about starting secondary school written by Mia, and Text B is a diary-style reflection about the first day written by Leo. Select two comparison points you would use to compare how the writers present starting secondary school in these passages. For each point, explain why it is useful to compare and show evidence from both texts by referring to a short quotation from Text A and a short quotation from Text B to illustrate the point. Text A: Today I walked into the big school building and felt my stomach flip. The corridor was loud, and I kept a tight grip on my timetable as if it were a shield. I looked for friendly faces, but most of them looked serious and busy. When I finally reached the library, the smell of old paper made me feel calmer, like the room was a small harbour in a storm. I told myself I would try to talk to someone at break, even if it felt scary. Text B: On my first day, I found the library easily and the librarian smiled after I asked for help. A girl in a blue hoodie waved to me and said, “This is a good place to start.” The shelves were neat, and the quiet hum of the computers sounded like a background song. I liked that people kept to themselves instead of shouting. I left with a new timetable and a plan to join the chess club; it felt like I had taken the first step into something I could do well.",
    "marks": 6,
    "markScheme": [
      "Identifies the contrast between initial anxiety and confidence.",
      "Supports that contrast with a quotation from each text.",
      "Explains what the contrast reveals about the experiences.",
      "Identifies the library as a shared source of reassurance.",
      "Supports this similarity with a quotation from each text.",
      "Explains the different form that reassurance takes."
    ],
    "answer": "First, compare the initial feelings. Mia’s “stomach flip” suggests anxiety, whereas Leo finds the library “easily” and receives a smile, suggesting a more welcoming arrival. This reveals different experiences of the same transition.\n\nSecond, compare the library’s reassuring role. For Mia it is a “small harbour in a storm”, a refuge from confusion. For Leo it is a “good place to start”, where help and a plan for the chess club suggest new opportunities. Both find support there, but Mia stresses relief while Leo stresses possibility.",
    "notation": false
  },
  "y8-english-comparison/practice-6-core-core": {
    "question": "Question 7: Read the two passages below about Lila and Sam. Identify two features you would compare to show how the writers create mood. For each feature, explain how the mood is shown in each passage, using short evidence from the text. Passage A: Rain tapped on the classroom windows as Lila tucked her notebook under her arm. The corridor smelled of damp coats and pencil shavings. She walked slowly, listening to the drip from a ceiling leak by the water fountain. In her head she kept replaying the maths lesson, but the numbers slid away like slippery fish. A note lay in the margin of her workbook: “Meet me by the gate after lunch.” Lila smiled, imagining the small moment of freedom. After lunch she stood at the gate, watching the puddles mirror the grey sky. The big walls of the school seemed to listen, waiting for something to happen. Passage B: The wind rattled the fence as Sam hurried to the park, his coat zipped up to his chin. Leaves swirled around his ankles and the sky wore a tired blue. He wrote a line on a scrap of paper: “I wish today would go slow.” He hopped over a muddy patch and muttered that the weather could not decide what it wanted to do. When he sat on the bench, the trees leaned in as if listening to his thoughts. The cold air felt calm, like a secret shared between the wind and him.",
    "hint": "Think about how weather and setting influence the mood in each passage.",
    "working": [
      "Step 1: Identify mood cues in Passage A (weather, surroundings, and small hopeful moment) and note how they create a sense of quiet anticipation or dull routine.",
      "Step 2: Identify mood cues in Passage B (wind, leaves, cold air, and a calm secret moment) and note how they create a reflective, calm mood.",
      "Step 3: State two features you would compare to show how mood is created: (1) Mood created by weather and setting; (2) Language choices and imagery describing feelings."
    ],
    "answer": "Compare weather and setting: in A, “Rain tapped” and “damp coats” suggest a dreary school day, while B’s wind that “rattled the fence” initially feels unsettled. Compare personification and private thoughts: A’s school walls seem to “listen”, creating anticipation, while B’s trees lean in “as if listening” and the air feels like a “secret”, making Sam’s solitude feel calm and personal.",
    "notation": false
  },
  "y8-english-poetry/exam-1-core-core": {
    "question": "Read this original teaching poem, preserving its eight line breaks.\n\nMorning in the street: cars hum, doors slam.\nI walk with careful steps—\nevery echo, a small caution.\nThe shop windows glare, bright blue,\nand I count the pigeons as they pair.\nFootsteps slow, breath shallow,\nuntil the kettle sighs\nand warmth returns.\n\nExplain how the form creates the speaker’s voice and mood. Refer to line length, line breaks, punctuation and enjambment, using evidence.",
    "marks": 4,
    "markScheme": [
      "Identifies a feature of line length or line breaks and connects it to the voice.",
      "Explains a plausible effect of the dash or other punctuation.",
      "Explains enjambment using an actual adjacent pair of lines.",
      "Relates changes in pace or form to the movement from caution towards comfort."
    ],
    "answer": "The dash after “careful steps—” interrupts the voice, suggesting hesitation. The brief phrase “every echo, a small caution” concentrates attention on small sounds. Later, “until the kettle sighs / and warmth returns” continues across a line break without stopping the sentence. This enjambment carries the voice towards the final reassurance. The last short line gives “warmth returns” emphasis, completing the movement from unease towards comfort.",
    "notation": false
  },
  "y8-geography-development-and-globalisation/exam-4-core-core": {
    "question": "Describe two positive roles and two negative impacts of transnational corporations in developing countries, using the following scenario: GreenTech, a transnational corporation, operates a factory in Country A, a developing country. The factory employs 1,500 local workers, paying an average wage of £350 per month. It buys 60% of its inputs from local suppliers, provides training for workers, pays local taxes, and helps build a road linking the factory to the main highway. Some residents report increased traffic and pollution near the factory, and a few local small firms feel they are being squeezed out.",
    "marks": 4,
    "markScheme": [
      "Jobs and wages raise income for local households.",
      "Local purchasing supports suppliers, or training builds skills.",
      "Traffic and pollution can damage health and the local environment.",
      "Competition from the corporation can squeeze smaller local firms."
    ],
    "answer": "The factory provides 1,500 local jobs and wages, raising household incomes. Buying from local suppliers supports other businesses. However, extra traffic and pollution can harm residents and the environment. Smaller local firms may lose customers or struggle to compete. The effects therefore vary between groups.",
    "notation": false
  },
  "y8-geography-development-and-globalisation/practice-4-core-core": {
    "question": "Explain how global supply chains work, using the journey of a hoodie as an example. In this chain, cotton is grown in India, spun into yarn and made into fabric in Bangladesh, dyed in China, assembled into hoodies in Vietnam, and finally sold in the United Kingdom. Name at least three stages in this supply chain, and explain one advantage and one drawback of having such a global chain for a clothing company.",
    "hint": "Think about where each stage happens and why firms choose different countries.",
    "working": [
      "Step 1: Identify the stages in the hoodie journey: farming cotton in India, spinning yarn and making fabric in Bangladesh, dyeing in China, assembling the hoodie in Vietnam, and selling in the UK.",
      "Step 2: Explain that these stages are linked by transport and trade so the final product reaches the UK.",
      "Step 3: State a benefit: lower costs and access to different skills and resources in each country.",
      "Step 4: State a risk: potential delays or disruptions in shipping or changes in trade rules that can affect production."
    ],
    "answer": "Global supply chains are networks where different parts of making a product occur in different countries and are then brought together for sale. For the hoodie: stages include farming cotton in India, spinning in Bangladesh, dyeing in China, assembling in Vietnam, and selling in the UK. A key advantage is lower costs and access to diverse skills and materials. A key drawback is the risk of delays or disruptions in transport or trade rules that can hold up delivery of the final product.",
    "notation": false
  },
  "y8-geography-global-ecosystems/exam-8-core-core": {
    "question": "In the Sundarbans mangrove forest, a sustainable management programme is being carried out to protect mangroves, support local livelihoods, and promote ecotourism. The plan states that 10,000 hectares of mangroves will be protected from illegal logging, 8 guided boat trips per day will be offered for ecotourism, and £450,000 will be spent each year on running the programme. After three years, illegal logging had fallen by 20%, and local families earned an average of £135,000 per year from ecotourism. Some residents say the programme helps biodiversity and provides income, while others argue it reduces farming land and may not create enough local jobs. Evaluate the effectiveness of this sustainable management programme. In your answer, discuss environmental, social and economic impacts, give two reasons why it is successful, and two reasons why it might fail, and suggest one improvement that could increase sustainability.",
    "marks": 5,
    "markScheme": [
      "Identifies an environmental benefit: protecting 10,000 hectares of mangroves helps biodiversity and coastal protection.",
      "Identifies a social or economic benefit: local families earning £135,000 per year from ecotourism shows positive livelihoods.",
      "Identifies an environmental outcome: illegal logging falling by 20% after three years indicates reduced pressure on the mangroves.",
      "Identifies a drawback: some farming land is reduced or restricted, potentially harming food production or livelihoods.",
      "Proposes an improvement: suggests a way to increase sustainability, such as diversifying income sources or increasing local involvement (e.g., more jobs or community projects)."
    ],
    "answer": "The programme has clear environmental benefits, social benefits, and some economic support, but it also has limitations that could limit long-term sustainability. Environmental Protecting 10,000 hectares of mangroves from illegal logging helps preserve biodiversity and strengthens the coastline against storms. The 20% drop in illegal logging after three years shows the policy is making a real difference to mangrove health. This protection helps keep mangroves as important carbon stores and habitats for wildlife, supporting the wider global ecosystem. Social Local families earning £135,000 per year from ecotourism shows that the programme can provide income and jobs for people living nearby, which is a key part of sustainability. However, some people worry that the land used for ecotourism and conservation reduces farming land, which could limit food production or reduce other types of work for the community. Economic The programme spends £450,000 each year, but £135,000 comes back to local people through ecotourism. Income received by local families does not automatically fund the programme. Its net operating cost cannot be calculated without knowing its own revenues. Reliable programme funding and household livelihoods should be assessed separately. If tourism numbers fall, or if costs rise, funding for conservation could be at risk, affecting long-term sustainability. Two reasons it is successful Environmental protection: 10,000 hectares are safeguarded, and illegal logging has decreased by 20%, benefiting biodiversity and coastal protection. Local livelihoods: Earnings from ecotourism provide income for families, supporting community well-being. Two reasons it might fail Land-use conflict: Protecting mangroves may reduce land available for farming, which could hurt food security and local livelihoods. Dependence on tourism: Economic benefits rely on visitors; a drop in tourism could reduce household income; the effect on programme funding depends on its revenue sources. Improvement (one suggestion) Diversify income and activities beyond ecotourism, such as mangrove nursery projects, sustainable harvesting of forest products, and community-led conservation programmes, to reduce reliance on tourism and spread benefits more widely.",
    "notation": false
  },
  "y8-geography-global-ecosystems/practice-8-core-core": {
    "question": "In a tropical rainforest reserve, the total forest area at the start of the year is 1,500 square kilometres. Each year, 60 square kilometres are cleared for farming and 40 square kilometres are reforested elsewhere. A plan called \"Forest Growth\" proposes increasing reforestation to 90 square kilometres per year. a) Under current management, is the forest area increasing, decreasing, or staying the same? b) Under the Forest Growth plan, what would be the annual change in forest area (in square kilometres per year)? c) Explain two reasons why keeping the forest area constant could be important for sustainable management of ecosystems, and one reason why it might be difficult to keep it constant. d) Do you think the current management or the Forest Growth plan is more sustainable? Give one reason for your view and one improvement you would suggest.",
    "hint": "Compare what is removed by deforestation with what is added by reforestation.",
    "working": [
      "Net area change is reforestation minus clearance.",
      "Current management: 40 − 60 = −20 km² per year, a decrease.",
      "Proposed plan: 90 − 60 = +30 km² per year, an increase.",
      "Forest protection supports biodiversity and carbon storage, but farming pressures and costs can make protection difficult.",
      "New planting needs time to develop into a mature ecosystem; reducing clearance is also important."
    ],
    "answer": "Current management loses 20 km² of forest per year (40 − 60 = −20). The proposed plan gains 30 km² per year (90 − 60 = 30). Protecting forest helps preserve habitats and carbon storage. Competing demand for farmland can make this difficult. The proposed plan improves the area balance, but newly planted forest does not immediately replace a mature forest ecosystem. A stronger plan would reduce clearance of existing forest, involve local communities and use suitable native species.",
    "notation": false
  },
  "y8-geography-population-and-urbanisation/exam-3-core-core": {
    "question": "Country X has the following population data (in thousands) by age group and sex: 0-4: M 62, F 65; 5-9: M 60, F 63; 10-14: M 58, F 60; 15-19: M 52, F 56; 20-24: M 48, F 50; 25-29: M 40, F 44. a) Which age group has the most people in total? Show your working. b) What does this say about the relative sizes of the age groups shown, and what information is missing about older people? c) Name one service that would be in high demand because of this age structure. d) Calculate the total population aged 0-29 (in thousands).",
    "marks": 4,
    "markScheme": [
      "0-4 age group has the largest total (62 + 65 = 127 thousand).",
      "The younger age groups shown are larger; ages 30 and over are missing, so the full population age structure cannot be established.",
      "A service in high demand would be schools/teachers due to many children and teenagers.",
      "Total aged 0–29: 127 + 123 + 118 + 108 + 98 + 84 = 658 thousand."
    ],
    "answer": "a) Ages 0–4: 62 + 65 = 127 thousand, the largest group shown. b) Younger groups are larger within these data, but ages 30 and over are missing, so we cannot describe the whole age structure confidently. c) Schools and teachers would serve the children shown. d) The total aged 0–29 is 658 thousand.",
    "notation": false
  },
  "y8-geography-population-and-urbanisation/exam-9-core-core": {
    "question": "In Eldoria, population figures are given in three age groups with gender counts: 0–14 years: M 540,000; F 540,000. 15–64 years: M 1,540,000; F 1,560,000. 65+ years: M 260,000; F 340,000. Using these figures, answer: a) What is the total population? b) How many people are dependents (0–14 and 65+ combined)? c) How many are in the working-age group (15–64)? d) What is the dependency ratio as a percentage (dependents per 100 working-age people)? e) Calculate and interpret the youth dependency ratio (ages 0–14 per 100 working-age people).",
    "marks": 5,
    "markScheme": [
      "Total population: 540,000 + 540,000 + 1,540,000 + 1,560,000 + 260,000 + 340,000 = 4,780,000",
      "Dependents (0–14 and 65+): (540,000 + 540,000) + (260,000 + 340,000) = 1,080,000 + 600,000 = 1,680,000",
      "Working-age (15–64): 1,540,000 + 1,560,000 = 3,100,000",
      "Dependency ratio: (1,680,000 / 3,100,000) × 100 = 54%",
      "Youth dependency ratio: 1,080,000 ÷ 3,100,000 × 100 ≈ 34.8 children per 100 working-age people."
    ],
    "answer": "Total population: 4,780,000. Age-group dependents: 1,680,000. Working-age population: 3,100,000. Total dependency ratio: approximately 54.2 per 100 working-age people. Youth dependency ratio: approximately 34.8 children per 100 working-age people. These demographic age groups do not establish whether each individual is employed or dependent.",
    "notation": false
  },
  "y8-geography-population-and-urbanisation/practice-1-core-core": {
    "question": "In the town of Brookfield, 320 people moved into the town during the last year, and 180 people moved away during the same year. The town had 15,600 residents at the start of the year. Explain, using these data, whether Brookfield had net in-migration or net out-migration, calculate the net number of people moving to or away from Brookfield, and give two likely reasons why people might have moved to Brookfield.",
    "hint": "Check whether more people moved in or out.",
    "working": [
      "Step 1: In-migration = 320 people; out-migration = 180 people.",
      "Step 2: Net migration = in - out = 320 - 180 = 140.",
      "Step 3: Net migration is positive, so Brookfield has net in-migration (more people moved in than moved out).",
      "Step 4: Two likely reasons for moving to Brookfield could be more jobs and better housing or amenities (such as schools, shops, or affordable rents)."
    ],
    "answer": "Brookfield has net in-migration of 320 − 180 = 140 people. Possible reasons include job opportunities and access to housing or services. These are plausible explanations, not facts established by the migration totals.",
    "notation": false
  },
  "y8-geography-rivers-and-coasts/exam-8-core-core": {
    "question": "A town on the River Alder experiences regular flooding along a 1.8 km stretch of riverbank. The council is considering three management options to reduce flood risk and protect habitats: A) Build a concrete flood wall along 1.8 km at £120,000 per km; this would reduce flood damage by 75% but would destroy river habitats along that stretch. B) Reinforce the riverbank with rock armour (rip-rap) along 1.8 km at £60,000 per km; reduces flood damage by 40% with little impact on habitats. C) Create a managed realignment by allowing the river to flood a 2.0 km floodplain at £50,000 per km; reduces flood damage by 60% and increases habitats. The baseline annual flood damage without any protection is £240,000 per year. For each option, calculate the net cost or saving in the first year (investment minus avoided damages). Then evaluate which option gives the best value for money, and briefly explain any environmental considerations.",
    "marks": 6,
    "markScheme": [
      "Correct calculation of Option A net cost (£216,000 investment minus £180,000 avoided = £36,000 net cost).",
      "Correct calculation of Option B net cost (£108,000 investment minus £96,000 avoided = £12,000 net cost).",
      "Correct calculation of Option C net saving (£100,000 investment minus £144,000 avoided = −£44,000 net cost; equivalently, a £44,000 saving).",
      "Identification that Option C offers the best value for money in the first year because it yields a net saving.",
      "Recognition of environmental/habitat impacts: Option A harms habitats; Option B has little habitat effect; Option C increases habitats.",
      "A justified conclusion linking cost and environmental considerations (Option C is best overall in Year 8 terms, with cost saving and habitat benefits)."
    ],
    "answer": "Option A: Investment £216,000; flood damage after protection = £60,000 (75% reduction from £240,000); avoided damages = £180,000; net first-year cost = £216,000 − £180,000 = £36,000 (a net cost of £36,000). Option B: Investment £108,000; flood damage after protection = £144,000 (40% reduction from £240,000); avoided damages = £96,000; net first-year cost = £108,000 − £96,000 = £12,000 (a net cost of £12,000). Option C: Investment £100,000; flood damage after protection = £96,000 (60% reduction from £240,000); avoided damages = £144,000; net first-year cost = £100,000 − £144,000 = −£44,000 (a net saving of £44,000). Best value for money in the first year: Option C, because it saves £44,000 overall (net saving) rather than costing money in the first year (Options A and B). Environmental considerations: Option A would destroy river habitats where the wall is built; Option B would have little effect on habitats; Option C would increase habitats by creating a floodplain area and supporting wildlife. Therefore, Option C combines financial saving with positive habitat benefits.",
    "notation": false
  },
  "y8-geography-rivers-and-coasts/practice-1-core-core": {
    "question": "A plan of a meander labels A on the outside of the bend and B on the inside. At A the bank is steep and the channel is deeper; at B there is a gently sloping deposit of sand and gravel. Identify the landform at each label and explain how it forms.",
    "hint": "Link the outer bank to erosion and the inner bank to deposition.",
    "working": [
      "A is a river cliff on the outer bank.",
      "Faster flow near the outer bank promotes erosion, including hydraulic action and abrasion, producing a steep bank.",
      "B is a slip-off slope on the inner bank.",
      "Slower flow there deposits sediment, producing a gently sloping bank."
    ],
    "answer": "A is an eroded river cliff; B is a depositional slip-off slope. Faster outer-bank flow promotes erosion, while slower inner-bank flow allows deposition.",
    "notation": false
  },
  "y8-geography-south-asia-a-regional-study/practice-2-core-core": {
    "question": "Question 3: In the South Asia regional study, the fictional country of Latha has the following shares of people employed in each sector: Primary sector 18% (farming, fishing and mining), Secondary sector 22% (manufacturing), Tertiary sector 40% (services such as shops, schools and hospitals), and Quaternary sector 20% (knowledge‑based activities). Using these figures, compare how important each sector is to Latha's economy. Which sector has the largest share of employment, and which has the smallest? Give two reasons why the largest sector matters for people’s jobs and living standards, and name one challenge the smallest sector might face in the future.",
    "hint": "Look for the biggest and smallest figures to compare the sectors.",
    "working": [
      "Step 1: Read the sector shares: Primary 18%, Secondary 22%, Tertiary 40%, Quaternary 20%.",
      "Step 2: Identify the largest share: 40% in the tertiary sector.",
      "Step 3: Identify the smallest share: 18% in the primary sector.",
      "Step 4: The largest sector (tertiary, 40%) matters because it employs many people and provides everyday services that people use.",
      "Step 5: It also supports the economy by allowing trade, education, and health services, which help other sectors as well.",
      "Step 6: The smallest sector (primary, 18%) might face the challenge of fewer farming jobs as people move to cities for work."
    ],
    "answer": "Tertiary employment is largest at 40%, followed by secondary at 22%, quaternary at 20% and primary at 18%. Services provide many jobs and income, and services such as schools and hospitals support living standards. Primary activity remains important despite its smaller employment share; farming may face drought or other climate risks. Employment shares alone do not measure each sector’s output or value.",
    "notation": false
  },
  "y8-history-stuarts-and-civil-war/practice-2-core-core": {
    "question": "After the English Civil War, two big changes happened to English government. First, in 1649 Charles I was executed and England was without a king for several years. Second, Parliament grew in power and could make more decisions with less input from the king. Between 1649 and 1660, which consequence had the bigger impact on English government: A) the execution of Charles I and the temporary abolition of the monarchy, or B) the growth of Parliament's power to pass laws? Explain your answer with two reasons.",
    "hint": "Think about who controlled laws and money during the 1650s.",
    "working": [
      "Charles I's execution in 1649 showed a king could be removed, shifting power toward Parliament and the army.",
      "Between 1649 and 1660, England had no king and Parliament/army ran the government, showing the direct effect of losing the monarchy.",
      "Parliament's growing power affected many decisions, but the lasting identity of the period came from ruling without a king.",
      "Therefore, the bigger impact was A) the execution and abolition of the monarchy."
    ],
    "answer": "I would choose A when judging the immediate change to the form of government between 1649 and 1660. First, executing Charles I and abolishing the monarchy removed the hereditary king from the political system. Second, government had to be organised without a monarch, through changing parliamentary and military arrangements. This does not mean Parliament simply gained uninterrupted control: its relationship with the army and Cromwell was often difficult. Another answer could emphasise Parliament if supported with clear evidence and a different criterion.",
    "notation": false
  },
  "y8-history-stuarts-and-civil-war/practice-8-core-core": {
    "question": "After Charles I’s execution in 1649, the monarchy and House of Lords were abolished. During the 1650s, government involved changing arrangements between Parliament and the army; Cromwell became Lord Protector in 1653. Restrictions on some festivities and religious practices affected daily life. Assess one political and one social consequence, explaining why different people could judge them differently.",
    "hint": "Political loyalties and religious beliefs influenced how people experienced these changes.",
    "working": [
      "Removing the monarchy and Lords changed the institutions of government. Royalists could see this as a loss, while supporters of a republic could welcome it.",
      "Army power and disputes with Parliament meant that the period was not simply uninterrupted parliamentary rule.",
      "Restrictions on festivities could upset people who valued them, while some religious reformers supported them.",
      "Avoid claiming that every noble or ordinary person had the same experience."
    ],
    "answer": "Political institutions changed sharply, but power was contested between civilian and military authorities. Social restrictions could be welcomed by some reformers and opposed by others. Consequences depended on people’s beliefs, loyalties and circumstances.",
    "notation": false
  },
  "y8-history-transatlantic-slavery-and-empire/exam-1-core-core": {
    "question": "Read this fictional teaching account; it is not a surviving diary. “Enslaved people were forced to work long days under an overseer. They tried to maintain languages and songs connecting them with home. Some hid tools to interrupt work, and families shared messages when they could.” Explain two hardships and two forms of resistance or cultural survival shown in the account. What limit does its fictional origin place on its use as historical evidence?",
    "marks": 5,
    "markScheme": [
      "Forced labour denied freedom and control over daily life.",
      "Long work and surveillance limited rest or family contact.",
      "Hiding tools is presented as resistance to plantation labour.",
      "Maintaining language, songs or family links is presented as cultural survival.",
      "A fictional account illustrates themes but cannot establish what a particular enslaved person experienced; real sources are needed."
    ],
    "answer": "Forced labour denied freedom, while long work and surveillance restricted rest and family contact. Hiding tools could disrupt the imposed work. Maintaining languages, songs and family links helped preserve identity and relationships. This teaching account illustrates these themes, but its invented origin means it is not direct evidence of an individual’s experience.",
    "notation": false
  },
  "y8-history-transatlantic-slavery-and-empire/practice-4-core-core": {
    "question": "Consider this fictional teaching summary, not a quotation from a historical source: “An enslaved person was forced to work without choosing their conditions. They tried to maintain family ties and cultural traditions despite restrictions.” Explain two aspects of their experience that a historian should investigate. What are the limits of using this summary alone?",
    "hint": "Consider both coercion and people’s attempts to preserve relationships and culture.",
    "working": [
      "Investigate forced labour and restrictions on freedom, including how conditions varied between places and periods.",
      "Investigate family relationships and cultural practices to understand people’s lives beyond their labour.",
      "This invented summary cannot establish what a particular person experienced. Historians need traceable sources, including enslaved people’s own accounts where available, and must consider their context and limitations."
    ],
    "answer": "A historian should investigate coercion and working conditions alongside family, culture and personal agency. The fictional summary raises questions but is not historical evidence about a named person.",
    "notation": false
  },
  "y8-history-transatlantic-slavery-and-empire/practice-5-core-core": {
    "question": "Which argument best explains pressure for Britain’s 1807 abolition of the slave trade: moral and religious campaigning, or organised political campaigning through petitions, pamphlets and speeches? Compare both, explain how they could reinforce each other, and give a supported judgement. Distinguish passing the law from enforcing it afterwards.",
    "hint": "Beliefs could motivate campaigners, while organised action brought their demands before Parliament.",
    "working": [
      "Moral and religious objections challenged the legitimacy of the trade and motivated campaigners.",
      "Petitions, publications and speeches spread arguments and put pressure on Parliament.",
      "These explanations overlap: organised campaigns could communicate moral objections.",
      "One defensible judgement prioritises political organisation because it connected public demands with parliamentary action, while recognising its moral motivation.",
      "Naval suppression after abolition concerned enforcement; it cannot itself explain why Parliament had already passed the Act."
    ],
    "answer": "Political campaigning is a strong explanation because it brought demands before Parliament and sustained pressure for legislation. Moral and religious arguments helped motivate that campaigning, so the factors reinforced each other. This is a supported judgement, not the only acceptable ranking or a complete account of abolition’s causes.",
    "notation": false
  },
  "y8-history-transatlantic-slavery-and-empire/practice-8-core-core": {
    "question": "For Question 9 in this Year 8 unit on Transatlantic Slavery and Empire, evaluate which explanation—religious/moral, humanitarian, or economic—best explains why abolition supporters argued to end the British slave trade between 1770 and 1807. Use the three fictional teaching statements below. They are not quotations from historical documents: Source A (Religious/Moral): \"Slavery is a crime against humanity; all people are created equal.\" Source B (Humanitarian): \"The slave trade costs lives and harms Britain’s reputation; ending it would improve life for many and protect the empire.\" Source C (Economic): \"Ending the slave trade will remove costly risks and help Britain grow economically in the long run.\" Provide a short answer with clear justification.",
    "hint": "Think about which sources stress beliefs about morality, which describe people suffering, and which focus on money and growth; decide which argument MPs would have found most persuasive.",
    "working": [
      "A presents moral equality as a reason to oppose slavery.",
      "B stresses loss of life and Britain’s reputation.",
      "C claims economic benefits, but supplies no evidence for that claim.",
      "A supported answer can compare these arguments, but three invented statements cannot prove which explanation best accounts for historical decisions."
    ],
    "answer": "A and B challenge the harm and injustice of the trade; C instead claims an economic benefit from ending it. I find the moral case compelling because it challenges treating people as property. However, evaluating which argument most influenced abolition supporters requires real sources, their dates and authors, and wider context. The fictional statements alone cannot establish that historical ranking.",
    "notation": false
  },
  "y8-history-tudors-and-reformation/practice-8-core-core": {
    "question": "A fictional teaching account describes a village where a monastery had provided charity and employment before its closure during the Dissolution. Its land then passed to a new owner. Explain two ways the closure could affect local people and one reason its effects might vary between communities.",
    "hint": "Consider the services lost and the choices made by a new landowner.",
    "working": [
      "People receiving monastery charity could lose an important source of support.",
      "Workers or suppliers connected to the monastery could lose employment or customers.",
      "A new owner might use the land differently or offer replacement work, so outcomes could vary.",
      "This invented account illustrates possible effects; evidence from a named community would be needed to establish what happened there."
    ],
    "answer": "Closure could remove charity and employment, making life harder for some residents. Effects depended on local reliance on the monastery and on how the new owner used its land and resources.",
    "notation": false
  },
  "y8-science-ecosystems/practice-9-core-core": {
    "question": "In a small pond there are these organisms: algae (producer), other zooplankton, water flea, small fish, dragonfly nymphs, heron, and bacteria (decomposer). The following feeding relationships exist: algae is eaten by other zooplankton; algae is eaten by water flea; other zooplankton is eaten by small fish and dragonfly nymphs; water flea is eaten by small fish and dragonfly nymphs; small fish is eaten by heron; dragonfly nymphs are eaten by heron; bacteria decompose dead matter. Using only this information, write down the feeding links that form the food web by naming who eats whom (in the form 'X is eaten by Y'), then add a separate statement about decomposition. Here other zooplankton excludes the separately listed water fleas.",
    "hint": "Remember to include the decomposer in your web, too.",
    "working": [
      "Follow each supplied feeding relationship from the organism being eaten to its consumer; keep other zooplankton separate from the named water fleas.",
      "List both consumer branches where supplied, then describe bacteria decomposing dead matter separately."
    ],
    "answer": "Algae is eaten by other zooplankton.\nAlgae is eaten by water fleas.\nOther zooplankton are eaten by small fish.\nOther zooplankton are eaten by dragonfly nymphs.\nWater fleas are eaten by small fish.\nWater fleas are eaten by dragonfly nymphs.\nSmall fish are eaten by herons.\nDragonfly nymphs are eaten by herons.\n\nBacteria decompose dead matter.",
    "notation": false
  },
  "y8-science-systems/practice-9-core-core": {
    "question": "A pupil eats a slice of bread with a small amount of butter. Describe, in order, what happens during digestion from chewing this food to the point where nutrients are absorbed in the small intestine. Include where mechanical digestion happens, which enzymes break down carbohydrate and fat, and where nutrient absorption occurs.",
    "hint": "Think about the roles of teeth, stomach muscles, enzymes in saliva and the small intestine, and bile in fat digestion.",
    "working": [
      "Teeth break the food into smaller pieces. Salivary amylase begins starch digestion.",
      "The stomach churns food; its acidic conditions support protein digestion.",
      "In the small intestine, enzymes complete carbohydrate digestion to simple sugars. Bile breaks fat into small droplets, increasing the surface area for lipase.",
      "Lipase breaks down fats. Digested nutrients are absorbed through the lining of the small intestine.",
      "Simple sugars and amino acids enter blood capillaries. Much absorbed fat travels through the lymphatic system before reaching the blood."
    ],
    "answer": "Chewing and stomach churning break food up physically. Amylase begins starch digestion, and enzymes in the small intestine complete digestion to small soluble molecules. Bile emulsifies fat and lipase digests it. Nutrients are absorbed through the small intestine: sugars and amino acids enter the blood, while much absorbed fat reaches the blood via the lymphatic system.",
    "notation": false
  },
  "y8-science-waves/exam-9-core-core": {
    "question": "Compare transverse and longitudinal waves using a wave on a rope and sound in air. Describe the vibration direction in each. Then explain why light can travel through a vacuum but sound cannot.",
    "marks": 5,
    "markScheme": [
      "In a transverse rope wave, the rope vibrates perpendicular to the direction of energy transfer.",
      "In a longitudinal sound wave, air particles vibrate parallel to the direction of energy transfer.",
      "Sound in air produces compressions and rarefactions.",
      "Light is electromagnetic and can travel through a vacuum.",
      "Sound needs a material medium; transverse mechanical waves on a rope also need a medium."
    ],
    "answer": "A rope wave is transverse: the rope vibrates perpendicular to the direction the wave travels. Sound in air is longitudinal: particles vibrate parallel to the wave direction, producing compressions and rarefactions. Light is an electromagnetic wave and needs no material medium, so it can cross space. Sound requires a medium. Being transverse does not by itself mean a wave can travel through a vacuum: a rope wave cannot.",
    "notation": false
  },
  "y9-computing-ethics-law-and-the-environment/exam-0-AQA-core": {
    "question": "Question 1 (Apply legal principles): A local school council launches an app called EcoAware to help pupils report environmental actions and receive reminders about local recycling events. The app collects the following data from users: full name, year group, email address, approximate location (town), and a password for logging in. It stores data on a cloud server and shares pupil names and email addresses with a local environmental charity so the charity can send event invitations. When a user is under 16, the app requires parental consent via an email link that the parent must approve before their data can be used. Data is retained for 12 months after the last activity, then automatically deleted. Personal information is encrypted in transit and at rest; passwords are stored using a suitable salted password-hashing scheme. The privacy policy states that users can delete their accounts at any time. Identify which legal principles apply, and identify compliance questions that still need checking under UK data-protection principles. If anything is not compliant, describe what should be changed.",
    "marks": 5,
    "markScheme": [
      "Identifies the need for a lawful basis, transparency and a defined purpose.",
      "For a consent-based information society service offered directly to a child in the UK, parental authorisation is required below 13; under-16 is not the universal UK GDPR threshold.",
      "Charity sharing needs its own justified purpose, lawful basis and clear information; a notice alone does not make it lawful.",
      "Only necessary data should be collected, and the 12-month retention period needs a purpose-based justification.",
      "Security and rights must be addressed; the limited scenario cannot establish complete legal compliance."
    ],
    "answer": "The app needs a lawful basis and clear, age-appropriate information about each use of data. If it relies on consent to offer an information society service directly to children in the UK, the relevant Article 8 threshold is 13, with parental authorisation below that age. An under-16 policy may be a separate choice, but is not a universal legal requirement. Sharing names and emails with a charity needs a justified purpose and lawful basis, not merely a privacy-policy sentence. The school should check whether all collected data and the retention period are necessary. Encryption and salted password hashing support security but do not prove complete compliance. The scenario leaves facts requiring further assessment.",
    "notation": false
  },
  "y9-computing-ethics-law-and-the-environment/practice-9-Edexcel-core": {
    "question": "A Year 9 ICT class is making a short video about recycling to post on the school website for the local community. They want to include three tracks they found online. Track A has a licence that requires attribution and states non-commercial use only. Track B has no licence and is marked \"All rights reserved\" (you cannot use it without permission). Track C has a Creative Commons licence with attribution and says it can be used for any purpose if attribution is given. They also want to include a short 15-second clip from a news website to illustrate a current event. Explain which music tracks the pupil can use without breaking copyright law, and what must be done with the news clip. In your answer, refer to copyright principles and simple actions the pupil could take to stay within the law.",
    "hint": "Check licence terms and whether the use is non-commercial; always give attribution where required.",
    "working": [
      "Check the full licence and the proposed use, not only whether the publisher is a school.",
      "A may be used only if its actual non-commercial and attribution conditions are met.",
      "C is available under the stated licence if all conditions are met; B needs permission unless a relevant exception applies.",
      "A 15-second duration creates no automatic exemption. Check the news owner’s licence or permission and whether a specific legal exception applies."
    ],
    "answer": "Track C is the clearest option under the stated terms, provided the required attribution and any other licence conditions are followed. A is possible only if the actual use meets its non-commercial condition; school or educational use is not automatically enough. B is not freely licensed, so obtain permission unless a relevant copyright exception applies. The news clip is not automatically free to use because it lasts 15 seconds. Ask the teacher to check a reuse licence, obtain permission, or assess a relevant exception such as fair dealing before publication. Attribution alone does not replace permission. A practical alternative is appropriately licensed footage with all conditions followed.",
    "notation": false
  },
  "y9-computing-programming-project/exam-8-AQA-core": {
    "question": "A program reads students.csv and writes report.txt. The test date is fixed as 05/11/2024. Input:\n\n```csv\nName,Score,Grade\nAna Lee,88,B\nRaj Singh,74,C\nMia Chen,99,A\n```\n\nThe output has these lines in order: Student Report; Generated on: 05/11/2024; Ana Lee - 88/100 (B); an empty line; Raj Singh - 74/100 (C); an empty line; Mia Chen - 99/100 (A); an empty line. For this test, use LF line endings and end every listed line, including the empty last line, with LF. Describe a functional comparison test, a boundary test using score 0 or 100, and one improvement that makes the program easier to test or more robust.",
    "marks": 6,
    "markScheme": [
      "Prepare and run the stated CSV fixture with the fixed test date.",
      "Compare the two exact header lines.",
      "Compare all student lines in the supplied order and exact format.",
      "Check blank lines and the final two LF characters after the last student line.",
      "Describe a boundary fixture and its exact expected score formatting.",
      "Explain one relevant robustness or testability improvement."
    ],
    "answer": "Run the program with the given CSV and compare the resulting text to this exact expected string, where \\n denotes one LF character:\n\n```text\nStudent Report\\nGenerated on: 05/11/2024\\nAna Lee - 88/100 (B)\\n\\nRaj Singh - 74/100 (C)\\n\\nMia Chen - 99/100 (A)\\n\\n\n```\n\nThe final two LF characters terminate the last student line and then the final empty line. A single trailing LF would not supply that final empty line. Record mismatches in content, order, spacing or line endings.\n\nFor a boundary test, use one row Sam Lee,0,F and expect the student line “Sam Lee - 0/100 (F)” followed by the same required empty line. The grade comes from the input; this task does not require calculating it. Improve testability by passing the report date as a parameter so tests can use a fixed value. Input validation with clear messages for invalid scores would improve robustness.",
    "notation": false
  },
  "y9-computing-programming-project/practice-9-AQA-core": {
    "question": "Analyse the requirements for a simple console-based \"Quiz Master\" program for a Year 9 Computing project under AQA. The program should present five multiple-choice questions (each with options A, B, C or D) to the user in order, read the user's answer as a single letter, and show the total score at the end. Identify at least two functional requirements (what the program must do) and at least two non-functional requirements (how the program should behave). Include any reasonable assumptions about the environment and user input.",
    "hint": "Focus on inputs, outputs, how the program handles wrong input, and how the user interacts with it.",
    "working": [
      "Functional requirements state the questions, input handling, scoring and final output.",
      "Re-prompting after invalid input is functional behaviour.",
      "Non-functional targets describe usability, compatibility and response time.",
      "State scoring and case-handling assumptions explicitly rather than silently assuming them."
    ],
    "answer": "Functional: present five questions in order with A–D options; read and validate one answer per question, re-prompting without scoring invalid input; compare it with the stored correct option; display the total after question five. Assumptions to agree: trim surrounding spaces, accept either letter case, award one point per correct answer and zero otherwise, and start at zero.\n\nNon-functional proposals: prompts remain readable in a standard 80-column terminal, and feedback appears within one second of valid input on the agreed school computer. Confirm the supported operating system and required runtime; a program is not automatically usable without software dependencies. These proposed targets should be tested.",
    "notation": false
  },
  "y9-computing-programming-project/practice-9-Edexcel-core": {
    "question": "You are designing a small class attendance tracker for a Year 9 Computing project. The class has 25 students. For each lesson the tracker must allow the teacher to set the date, mark each student as Present, Late or Absent, and save the data for that date. The teacher also wants to export the attendance data as a CSV file with columns Date, Student ID, Student Name, and Status. The program will run on school Windows 10 computers and must operate offline. Analyse the requirements for this project: identify at least two functional requirements, at least two non-functional requirements, and at least two constraints, and propose a simple set of success criteria to judge whether the project meets the requirements.",
    "hint": "Think about what data the program must store, how the teacher will interact with it, and what it must be able to do without internet.",
    "working": [
      "Step 1: Functional requirements - The program can mark attendance for all 25 students for a lesson; the user can set the date for that lesson; the program saves the attendance data for that date; the program exports data to a CSV file with Date, Student ID, Student Name, Status.",
      "Step 2: Non-functional requirements - The interface should be simple and easy to use; the program must work offline on Windows 10; it should respond quickly when marking attendance (e.g., for 25 students).",
      "Step 3: Constraints - Class size is fixed at 25 students for this project; the program must run on Windows 10 school computers; data is stored locally and the export must be a CSV for compatibility; no internet is required for core functions.",
      "Step 4: Success criteria - An attendance entry for a lesson can be completed and saved for all 25 students; a CSV file with the exact columns Date, Student ID, Student Name, Status is created and opens in a spreadsheet; data can be reopened later and reflects the correct date and statuses; the program operates without an internet connection."
    ],
    "answer": "Functional requirements: mark attendance for 25 students in a lesson; set the lesson date; save data for that date; export attendance to CSV with Date, Student ID, Student Name, Status. Non-functional requirements: easy-to-use interface; operates offline on Windows 10; responsive during entry; a proposed usability target, to agree with the teacher, is completing 25 entries within about two minutes. Constraints: class size fixed at 25; runs on Windows 10 school computers; data stored locally; CSV export required. Success criteria: can complete and save attendance for all 25 students for a lesson; CSV export contains the required columns and opens in a spreadsheet; data can be reopened later with correct date and statuses; operates without internet.",
    "notation": false
  },
  "y9-computing-web-technologies-and-data/exam-3-Edexcel-core": {
    "question": "4 You are designing a small, single‑page website for a school project called \"Library Corner\". Write the complete HTML and CSS required to structure and style this page so that it includes: a header with the site title, a navigation bar with three links labelled Home, Books and Contact, a main content area with a level-2 heading \"Welcome to Library Corner\" and a short paragraph about structuring HTML and CSS; and a footer with the text \"© 2026 Library Corner\". The CSS should: set the page background to light grey, use a sans-serif font (Arial or similar), make the header 80 pixels tall with a dark blue background and white text, arrange the navigation links in a single horizontal row with space between them, constrain the main content area to a width of 800 pixels and centre it, style the links in blue and make them darker blue when the mouse hovers over them. Your code must use HTML5 semantic elements (<header>, <nav>, <main>, <footer>) and be accessible (including a language attribute on the HTML tag and a viewport meta tag).",
    "marks": 6,
    "markScheme": [
      "Uses semantic HTML elements (header, nav, main, footer) to structure the page.",
      "Header is 80 pixels tall with a dark blue background and white text.",
      "Navigation links are displayed in a single horizontal row with spacing between them.",
      "Main content area is constrained to 800 pixels wide and centred on the page.",
      "Link colours are blue and change to a darker blue on hover.",
      "HTML includes lang attribute and viewport meta tag for accessibility and responsiveness."
    ],
    "answer": "```html\n<!doctype html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Library Corner</title>\n  <link rel=\"stylesheet\" href=\"styles.css\">\n</head>\n<body>\n  <header><h1>Library Corner</h1></header>\n  <nav aria-label=\"Main navigation\">\n    <a href=\"#home\">Home</a><a href=\"#books\">Books</a><a href=\"#contact\">Contact</a>\n  </nav>\n  <main id=\"home\">\n    <h2>Welcome to Library Corner</h2>\n    <p>HTML gives the page structure and CSS controls its presentation.</p>\n    <section id=\"books\"><h2>Books</h2><p>Explore our reading collection.</p></section>\n    <section id=\"contact\"><h2>Contact</h2><p>Visit the school library desk.</p></section>\n  </main>\n  <footer>© 2026 Library Corner</footer>\n</body>\n</html>\n```\n\nstyles.css:\n```css\n* { box-sizing: border-box; }\nbody { margin: 0; background: #eee; font-family: Arial, sans-serif; }\nheader { height: 80px; background: #123456; color: white; display: flex; align-items: center; padding: 0 20px; }\nnav { display: flex; gap: 20px; padding: 16px; }\na { color: #0645ad; }\na:hover, a:focus-visible { color: #032b69; }\nmain { max-width: 800px; margin: 0 auto; padding: 20px; }\nfooter { padding: 20px; text-align: center; }\n```",
    "notation": false
  },
  "y9-computing-web-technologies-and-data/exam-4-Edexcel-core": {
    "question": "A school website's web form collects four fields: Username, Email address, Age, and Phone number. For each field, describe a validation check you would apply on submission (state the type of validation and the exact rule, including any length or range constraints). For this exercise, propose rules for pupils aged 11–18 and a domestic mobile contact number in 11-digit format starting 07. These are system requirements, not universal rules for every school or phone number.",
    "marks": 4,
    "markScheme": [
      "Propose a username length or allowed-character check, with a clear rule.",
      "Propose a simple email format check and acknowledge that it does not verify the mailbox.",
      "Require an integer age from 11 to 18 inclusive under the stated assumption.",
      "Require the stated 11-digit 07 format, preserving the value as text."
    ],
    "answer": "Username: length check of 6–12 characters and an allowed-character check for letters and digits. Email: a basic format check for one @, text on both sides, a dot within the domain and no spaces; this does not prove the address exists. Age: integer/range check, 11–18 inclusive under the supplied system assumption. Phone: a text string of exactly 11 digits starting 07; preserve the leading zero. The format check does not prove that the number is assigned, reachable or owned by the user.",
    "notation": false
  },
  "y9-design-technology-inclusive-and-user-centred-design/exam-5-AQA-core": {
    "question": "You have designed an inclusive, easy-grip water bottle intended for a wide range of users, including those with reduced hand strength. To gather user feedback you tested a prototype with 12 people (9 Year 9 students and 3 staff) over a 1-week trial. Feedback came from a short questionnaire and a practical test of using the bottle one-handed. Results show: 9/12 found the grip comfortable; 5/12 found the lid difficult to open with one hand; 7/12 said the bottle is too tall to fit easily into a school bag; 4/12 reported the label's colour contrast is not high enough for readability. Based on this feedback, answer the following: Identify two issues from the feedback and explain why each matters for inclusive design. Propose two design changes to address these issues. Choose which change to implement first and justify your choice, including how you would test the redesigned bottle again with users. Explain how the feedback influenced your design decisions and what you learned about designing for a wide range of users.",
    "marks": 6,
    "markScheme": [
      "Identifies one issue from the feedback that affects usability (e.g., lid opening) and links it to inclusive design.",
      "Identifies a second issue from the feedback (e.g., height impacts bag storage) and links it to inclusive design.",
      "Proposes a design change to address issue 1 (e.g., easier lid with a textured grip or flip-top).",
      "Proposes a design change to address issue 2 (e.g., shorten height and adjust body to keep capacity).",
      "Justifies which change to implement first, with a clear, logical reason related to usability and inclusivity.",
      "Describes how to test the change with users again and how feedback will influence further design decisions."
    ],
    "answer": "Issue 1 identified: The lid is difficult to open with one hand (5/12 users reported this). Why it matters: For many users, including those with reduced hand strength or dexterity, a tough lid prevents access to the bottle and reduces independence, which is a key aim of inclusive design. Issue 2 identified: The bottle is too tall to fit easily into a school bag (7/12 users noted this). Why it matters: If the bottle won’t fit in common storage (bags, lockers), it becomes impractical for everyday use for many students, again limiting accessibility and usability. Change 1 to address Issue 1: Redesign the lid to be easier to open with one hand. Implement a flip-top lid with a wide, textured grip ring around the edge so fingers can press and lift more easily. This keeps the bottle’s basic shape but improves operability for users with less grip strength. Change 2 to address Issue 2: Measure the original bottle and representative bags, then propose a shorter body with any width change tested against required capacity and grip needs. This reduces overall height so it fits more easily in bags while maintaining a usable capacity. Which change to implement first and why: Implement Change 1 (lid redesign) first. Rationale: The ability to access the contents with one hand is a fundamental usability issue for many users and was reported by 5 of 12 testers. Making the lid easier to open directly improves accessibility and independence for a broad group, while recognising that implementation time has not been measured. How you would test the redesigned bottle again: Have the same 12 testers use the bottle for a week, focusing on the one-handed opening task. Ask them to rate ease of opening on a 1–5 scale (1 = very hard, 5 = very easy) and note any remaining issues. Collect brief written comments about comfort and any other accessibility concerns. Repeat the original difficult-to-open question as well as the new rating, and compare its count with the original 5/12 feedback to see if ease of opening improves and whether any new issues appear. How the feedback influenced design decisions and what you learned: The feedback highlighted that both usability (one-handed operation) and practicality (fit in school bags) affect inclusivity. Designers must consider how a product will be stored and carried as well as how it is used. I learned to test early with a diverse group of users and to prioritise changes that enable independent use (like easy-lid operation) before making larger dimensional changes. This shows that inclusive design is iterative: small changes to increase accessibility can have a big impact on everyday use, and clearer feedback helps decide which improvements to test first. The original sample is small and may not represent all intended users; include pupils with a range of grip abilities and hand preferences in further testing before generalising.",
    "notation": false
  },
  "y9-design-technology-inclusive-and-user-centred-design/exam-8-AQA-core": {
    "question": "A portable kitchen timer designed to be accessible for all pupils, including those with low vision or reduced dexterity. The timer has a rectangular outer shell 9.0 cm long, 4.5 cm wide and 2.0 cm thick. On the front is a circular dial with a diameter of 3.5 cm; the dial has bold black numbers on a white background and twelve tactile notches evenly spaced around the edge to mark a full 60-minute scale at 5-minute intervals. To the right of the dial is a large start/stop button, 3.0 cm in diameter. The device includes a silicone strap for wearing or carrying. It uses two AAA batteries and has an audible alarm that can be heard in a classroom. The aim is to evaluate the accessibility of the timer for users with low vision, dexterity limitations, or those wearing gloves, and suggest any improvements.",
    "marks": 5,
    "markScheme": [
      "Identifies that the high-contrast bold numbers on a white background aid readability for users with low vision.",
      "Notes that the tactile notches around the dial support reading/estimating time by touch, helping those with limited sight or dexterity.",
      "Points out that the large 3.0 cm diameter start/stop button aids operation for users with weak grip or when wearing gloves.",
      "Recognises that the silicone strap and the timer’s size improve handling and carrying, reducing the chance of dropping.",
      "Suggests improvements such as adding Braille or raised symbols and providing an adjustable audible alert and a visual indicator (LED) to support users with hearing or vision impairments."
    ],
    "answer": "The timer has several features that support accessibility well, with strengths that help learners with different needs. First, the dial uses bold black numbers on a white background, which gives good contrast and makes it easier to read for someone with reduced vision. The circular dial is 3.5 cm in diameter, but readability would need testing with intended users. The presence of twelve tactile notches around the edge provides a tactile cue for estimating time even when sight is limited or when the user is wearing gloves, which is helpful for those with dexterity difficulties who may struggle to rely on small visual cues alone. The start/stop button is large (3.0 cm in diameter), making it easier to press, especially for someone with weak finger strength or who needs to use the timer one-handed. The overall size and the silicone strap also improve grip and handling, reducing the risk of dropping the device during use. Despite these strengths, there are ways to improve accessibility further. For users with more severe visual impairment, the default high-contrast display might still be challenging; an option with a white-on-black contrast or larger numerals could help. For people with very limited dexterity, the single start/stop button could be supplemented with an additional larger, secondary button or a rocker switch to provide an alternative actuation method. The timer currently relies on an audible alarm, which may be hard to hear in noisy classrooms; adding a visual alert (LED light) and an adjustable alarm volume would support users with hearing difficulties and those in loud environments. Finally, adding Braille or embossed symbols on the case would give tactile recognition for users who cannot read print. The features may help, but user testing is needed to establish accessibility.",
    "notation": false
  },
  "y9-design-technology-inclusive-and-user-centred-design/practice-3-AQA-core": {
    "question": "Create a user profile for a Year 9 student who will use a school app designed for inclusive and user-centred design. The user will access the app for 25 minutes per session, twice daily, at a typical reading distance of 40 cm. The app may be used in a classroom with standard lighting. In your profile, include: name and age; physical abilities (handedness and motor control); sensory needs; context of use; goals; barriers; and two measurable design requirements with targets (for example font size, button size) that would make the app easier to use. Use the given usage time and distance to justify your measurable targets.",
    "hint": "Use the numbers given (25 minutes, 40 cm) to justify two design targets.",
    "working": [
      "Describe a fictional user and the stated context: two 25-minute sessions at about 40 cm.",
      "Propose an initial adjustable text-size target and test readability at that distance.",
      "Propose an initial touch-target size and test accurate selection with the intended user.",
      "The distance and duration inform testing; they do not mathematically determine a universal font or button size."
    ],
    "answer": "Fictional profile: Asha, 13, right-handed with good fine motor control, prefers adjustable brightness and clear contrast. She uses a tablet at a desk in standard classroom lighting for two 25-minute sessions, about 40 cm away. Her goals are comfortable reading and completing tasks; small text and crowded controls are barriers.\n\nTwo provisional design targets: (1) body text starts at 16 pt and can be enlarged; test comfortable reading at 40 cm across a session. (2) primary touch targets are at least 1.8 cm square on the test device; observe missed or accidental selections. These are design proposals to validate with users, not values derived from the viewing distance or guaranteed accessibility standards.",
    "notation": false
  },
  "y9-design-technology-inclusive-and-user-centred-design/practice-5-Edexcel-core": {
    "question": "A prototype timer measures 12.0 cm long and 6.0 cm wide. Its high-contrast display occupies a 5.0 cm by 3.0 cm area. Below it are four textured buttons of diameter 2.0 cm in a 2 by 2 grid, with centres 2.5 cm apart. It weighs 170 g, has a wrist strap and an audible alarm with three volume settings. Evaluate two possible benefits and two possible barriers for people with arthritis or visual impairment. Propose one improvement and explain what user testing is needed.",
    "hint": "Think about how easy the buttons are to press and how easy the numbers are to read in dim light.",
    "working": [
      "The button grid spans 4.5 cm in each direction: 2.5 cm between centres plus one diameter. It fits within the stated width.",
      "Large textured controls may help locate and press buttons, but activation force is not stated.",
      "High contrast may help some users see the display, but digit size and lighting also matter.",
      "A 170 g device may be tiring to hold for some users, and an audible alarm may not suit everyone.",
      "Adding a vibration alert offers another signal; test detection, comfort, button force and accidental presses with intended users."
    ],
    "answer": "Textured buttons and a high-contrast display may help operation and reading. However, unspecified button force could be a barrier for users with arthritis, and the device’s weight may be tiring for some users. A vibration alert could provide an additional cue. Test the prototype with intended users before claiming it is accessible.",
    "notation": false
  },
  "y9-design-technology-precision-manufacture/exam-0-AQA-core": {
    "question": "Write a manufacturing plan for producing 50 aluminium spacers. Each spacer is 6.0 cm long, 2.0 cm wide and 0.5 cm thick, with a central through hole diameter 3 mm drilled through the thickness at the middle of the spacer. From a 300 cm long aluminium bar with cross-section 2.0 cm by 0.5 cm, plan the sequence of operations, tools, approximate times for each operation, quality checks and tolerances, and safety considerations for the batch. First check whether the stock is sufficient once saw kerf and finishing allowance are included. Propose tolerances for agreement rather than treating unspecified values as established requirements.",
    "marks": 6,
    "markScheme": [
      "Recognise that 50 × 60 mm uses the entire 3,000 mm stock before kerf, so extra stock or an agreed design change is required.",
      "Give a sequence including setup, cutting with allowance, finishing, drilling, deburring and inspection.",
      "Choose suitable tools, support for long stock and clamping or jigs.",
      "Give labelled provisional times and a correct batch total.",
      "Propose tolerances for agreement and suitable dimensional and hole checks.",
      "Describe supervised safe working, no gloves near rotating machinery, and safe swarf removal."
    ],
    "answer": "Stock check: 50 × 60 mm = 3,000 mm, leaving no allowance for kerf or finishing. Obtain additional stock before promising 50 finished spacers. For an illustrative 2 mm kerf and 1 mm finishing allowance per blank, allow about 50 × 63 = 3,150 mm plus end trimming; confirm against the actual cutting plan.\n\nAgree tolerances, for example length ±0.2 mm, and check whether available processes can achieve the required hole size. Set up supported stock and a stop, cut oversize, finish to length, then locate the hole at the centre of the finished face: 30 mm from an end and 10 mm from a long side. Clamp each part in a drill jig, drill the 3 mm through-hole, and deburr. Check every part’s size and position; use suitable pin gauges for a tight small-hole tolerance rather than relying on large internal caliper jaws.\n\nProvisional one-operator times: setup 15 minutes; cut and finish 3 minutes per piece; drill 2; deburr 1; inspect 1; pack the batch 10. Total 15 + 50 × 7 + 10 = 375 minutes, excluding breaks. Validate by a timed trial.\n\nUse teacher-approved equipment, guards and eye protection. Clamp work, secure hair and clothing, and do not wear gloves near rotating drill parts. Stop machinery before adjustments or brushing away swarf; follow the workshop procedure and segregate metal waste.",
    "notation": false
  },
  "y9-design-technology-precision-manufacture/exam-0-Edexcel-core": {
    "question": "Write a manufacturing plan for 25 rectangular name badges, produced from clear acrylic 5 mm thick, sized 8.0 cm long by 3.5 cm high by 0.5 cm thick. The badges are cut using a laser cutter. The plan must include the sequence of operations, the equipment to be used, approximate times for each stage, safety considerations, and the quality control checks you would perform to ensure the finished badges meet the specification. Do not refer to diagrams, figures or tables.",
    "marks": 5,
    "markScheme": [
      "Identifies material (acrylic) and finished size, and batch quantity (1)",
      "Outlines a logical sequence of operations and the equipment to be used (1)",
      "Includes safety considerations (PPE, ventilation, safe operation) (1)",
      "Includes quality checks and acceptance criteria (1)",
      "Includes times for each stage and an overall total time (1)"
    ],
    "answer": "Manufacturing plan for 25 clear acrylic name badges (8.0 cm x 3.5 cm x 0.5 cm, 5 mm thick) Product and batch Product: rectangular name badge Material: clear acrylic sheet, 5 mm thick Finished size: 8.0 cm long × 3.5 cm high × 0.5 cm thick Batch quantity: 25 badges Equipment needed Laser cutter (capable of cutting acrylic cleanly) Computer with design file containing the badge outline Safety goggles and access to ventilation or fume extraction Cleaning cloths or lint-free tissues Fine abrasive cloth or deburring tool for finishing edges Packaging materials (card sleeves or small boxes) Operations sequence Setup and safety check (5 minutes) Turn on laser cutter and ventilation/extraction. Load the design file for the badge outline into the laser software. Ensure working area is clear of clutter and that PPE is available. Check that the acrylic stock is dry, clean and free from cracks. Laser cutting (25 badges) (25 minutes) Cut 25 outlines in clear acrylic to produce 25 badges with the specified finished size. Use the laser cutter to cut a 8.0 cm by 3.5 cm outline, 0.5 cm thick. The process will remove a small amount of material along each cut as the laser makes the edge. Produce only the required number of badges (25) and keep finished pieces flat. Deburring and edge finishing (6 minutes 15 seconds) Remove any small burrs or rough edges with a fine abrasive cloth or deburring tool. Ensure the edges look smooth and the surface is free from flaking. Cleaning and drying (4 minutes 10 seconds) Wipe each badge with a lint-free cloth to remove dust and fingerprints. Allow to dry completely before inspection. Quality control and packaging (2 minutes) Inspect each badge for: Correct overall size and shape (8.0 cm × 3.5 cm) and a clean edge with no burrs. Clear, intact surface with no deep scratches or warping. All 25 units produced and accounted for. Pack badges in individual sleeves or small boxes to prevent scratches during transport. Safety considerations Wear eye protection when operating the laser cutter. Ensure proper ventilation or fume extraction is running during laser cutting. Keep flammable materials away from the laser area and never leave the laser running unattended. Tie back long hair and avoid loose clothing near equipment. Keep the work area clean to prevent trips or damage to the machine. Quality control checks Visual check of edges for burrs and smooth finish. Confirm count equals 25 badges before packaging. Inspect for warping or surface blemishes; reject any badge with obvious defects. Times (summary) Setup and safety check: 5 minutes Laser cutting: 25 minutes Deburring/edge finishing: 6 minutes 15 seconds Cleaning: 4 minutes 10 seconds Quality control and packaging: 2 minutes Total approximate time: 42 minutes 25 seconds",
    "notation": false
  },
  "y9-design-technology-precision-manufacture/practice-0-AQA-core": {
    "question": "Write a manufacturing plan for making 40 spacers from acrylic rod stock for use as spacers between two components. Each spacer is a rectangular block measuring 3.0 cm long, 1.5 cm wide and 0.5 cm thick. Stock is rectangular acrylic bar, 25 cm long with the required 1.5 cm by 0.5 cm cross-section. For this simplified stock calculation, assume each cut removes a 0.1 cm kerf and one cut separates each spacer. The plan should include: the sequence of operations from cutting to finishing, the tools and equipment you would use, rough times for each operation, the tolerance on the final dimensions (all within ±0.2 cm), the quality checks you would perform (including safety and waste handling), and how many rods you would need and what the total waste would be. Use clear language appropriate for Year 9.",
    "hint": "Think about how many spacers you can get from one 25 cm rod and how many rods you will need.",
    "working": [
      "Eight spacers use 8 x 3.0 = 24.0 cm and eight kerfs use 0.8 cm, fitting within one 25 cm bar.",
      "Five bars provide 40 spacers. Total stock length is 125 cm.",
      "Finished spacers total 120 cm; total material not in the spacers is 5 cm, comprising 4 cm kerf waste and 1 cm remaining offcuts, before any further finishing losses."
    ],
    "answer": "Use five rectangular acrylic bars with the specified cross-section. Set a stop or mark each cut allowing 0.1 cm kerf; clamp the stock and use an appropriate fine-toothed saw under workshop supervision. Cut, deburr and lightly finish each spacer, then measure length, width and thickness with suitable measuring tools. Accept only dimensions within the specified ±0.2 cm and inspect for cracks and sharp edges.\n\nProvisional planning times: 8 minutes setup and marking, then 0.6 minute cutting, 0.4 minute finishing and 0.2 minute checking per part: 8 + 40 x 1.2 = 56 minutes. These are estimates to verify with a trial, not measured production rates. Keep eye protection on, secure work and collect acrylic waste using the workshop procedure.\n\nFive bars total 125 cm. The 40 finished lengths total 120 cm; nominal waste is 5 cm, including 4 cm of saw kerfs and 1 cm of offcuts before any additional finishing loss.",
    "notation": false
  },
  "y9-design-technology-precision-manufacture/practice-3-AQA-core": {
    "question": "Question 4. You are asked to manufacture 50 identical spacers for an assembly. The spacer is a rectangular block of aluminium with finished dimensions length 8.0 cm, width 3.5 cm, thickness 1.5 cm and a through-hole of diameter 0.5 cm drilled exactly at the centre. Write a manufacturing plan that explains the sequence of operations, the equipment and tools you would use (no diagrams), the timescales for production, the quality checks you would carry out, and how you would manage waste and safety to ensure all 50 spacers meet the specification.",
    "hint": "Plan a simple, repeatable process that can be used for all 50 units.",
    "working": [
      "Agree proposed tolerances and a workable process with the teacher before manufacture.",
      "Choose suitable stock, allowing for saw kerf and finishing; avoid unnecessary oversize in every direction.",
      "Cut and finish the external dimensions before locating the hole from the finished reference edges.",
      "Clamp in a jig and drill the 5 mm through-hole at 40 mm from an end and 17.5 mm from a long side.",
      "Deburr and inspect every part; record results and separate nonconforming pieces.",
      "Plan setup and per-part times, validate them with a trial and manage waste safely."
    ],
    "answer": "Agree tolerances before starting; the prompt gives nominal dimensions, not permitted variation. Source suitable aluminium stock with enough allowance for kerf and finishing. Cut blanks using an appropriate saw, finish each to 80 × 35 × 15 mm, and establish reference edges. Locate the 5 mm through-hole at 40 mm from an end and 17.5 mm from a long side. Clamp each part in a drilling jig, drill through, and deburr.\n\nCheck every part’s external dimensions, hole location and burr removal. Use a suitable gauge for the agreed hole tolerance. A proposed schedule is 20 minutes setup, then 3 minutes cutting/finishing, 2 minutes drilling, 1 minute deburring and 1 minute inspection per part, plus 10 minutes packing: 20 + 50 × 7 + 10 = 380 minutes before breaks. Treat these as planning estimates and validate with a trial.\n\nUse supervised, approved equipment with guards and eye protection. Secure work, hair and loose clothing. Do not wear gloves near the rotating drill; stop the machine before adjustments and remove swarf with a suitable brush under workshop procedures. Collect aluminium scrap for the appropriate recycling stream.",
    "notation": false
  },
  "y9-design-technology-precision-manufacture/practice-3-Edexcel-core": {
    "question": "Write a manufacturing plan for producing 200 aluminium plates for a model kit. The plates are rectangular, 12.5 cm long, 4.0 cm wide and 0.5 cm thick. Each plate has two holes of diameter 5 mm drilled through the plate, located 2.0 cm from each end along the length and centred across the width. Material: aluminium alloy 6082-T6. The plates are produced from sheet stock. Describe the sequence of operations, the tools and machines used, the approximate times for each operation for the batch, a simple quality-check method for each stage, and any safety considerations. The plan should be suitable for a Year 9 student.",
    "hint": "Plan the order of operations to avoid unnecessary handling and movement of parts.",
    "working": [
      "Agree tolerances and choose adequate 5 mm sheet stock with cutting and finishing allowance.",
      "Cut and finish external dimensions before locating holes 20 mm from each end and 20 mm across the width.",
      "Clamp in a drilling jig, drill both 5 mm holes, deburr and inspect.",
      "Use provisional batch times and validate them with a trial."
    ],
    "answer": "Agree tolerances and teacher-approved equipment first. Use enough 5 mm aluminium sheet for 200 finished 125 × 40 mm plates, allowing for the actual kerf, nesting and finishing. Mark and cut slightly oversize, then finish the edges square to the agreed dimensions. Check length, width and squareness before drilling.\n\nLocate hole centres at (20, 20) mm and (105, 20) mm measured from the same end and side. Clamp each plate in a suitable jig and drill both 5 mm holes. Deburr, clean using the approved method, then check dimensions, hole locations, diameters with suitable gauges and sharp-edge removal. Inspect every finished part and separate rejects.\n\nIllustrative one-operator times per plate: cutting and sizing 3 minutes, drilling 2, deburring 1, inspection 1 and packing 0.5. For 200 this is 1,500 minutes; add 30 minutes setup for 1,530 minutes, or 25.5 hours, excluding breaks. These are planning estimates to validate, not a promise that one pupil should complete the batch.\n\nUse supervision, guards and eye protection; secure hair, clothing and workpieces. Do not wear gloves near rotating drill or milling parts. Stop equipment before adjustments or removing swarf with a suitable brush, and follow workshop procedures for sharp stock and metal recycling.",
    "notation": false
  },
  "y9-design-technology-precision-manufacture/practice-6-Edexcel-core": {
    "question": "You are making 30 aluminium spacers for a model project. Each spacer is a rectangular block 9.5 cm long, 2.5 cm wide and 0.8 cm thick, with a through-hole of diameter 0.5 cm located at the centre. Write a manufacturing plan that would produce all 30 spacers with acceptable quality. Your plan should include: material choice and reason; the sequence of operations (in order) to produce one spacer and then to batch-produce 30; the tools you would use for each operation; the approximate time spent on each spacer for drilling hole (0.5 minutes), deburring (0.5 minutes) and finishing (0.5 minutes); the checks you would carry out to ensure length, width, thickness and hole diameter are within acceptable limits; how you would separate and package parts; and the subtotal for the three timed operations and any additional tasks whose time has not been supplied.",
    "hint": "Include a centre mark for locating the hole and a simple quality check step.",
    "working": [
      "Drilling, deburring and finishing total 0.5 + 0.5 + 0.5 = 1.5 minutes per spacer.",
      "For 30 parts, those operations total 45 minutes.",
      "Setup, marking, cutting, inspection and packaging add further time, so 45 minutes is not the complete production time."
    ],
    "answer": "Use aluminium because it is relatively light and can be machined for this model component. Obtain suitable stock, mark out, cut and finish blanks to 9.5 x 2.5 x 0.8 cm, then mark each hole centre 4.75 cm from the end and 1.25 cm from the side. Clamp the part and drill the 0.5 cm through-hole using suitable guarded equipment under supervision. Deburr the hole and edges, then finish the surfaces. Batch each operation with a first-piece check before continuing.\n\nUse calipers and an appropriate hole gauge to check dimensions against tolerances agreed in the design specification; the question supplies no numerical tolerances. Check hole location and sharp edges. Separate accepted and rejected parts, and package accepted parts so they cannot damage one another. Wear eye protection, secure hair/clothing and keep hands clear of cutting tools.\n\nThe three supplied operation times total 1.5 minutes per part, or 45 minutes for 30. Add setup, cutting, marking, inspection and packaging time before quoting an overall batch duration.",
    "notation": false
  },
  "y9-design-technology-precision-manufacture/practice-9-AQA-core": {
    "question": "Question 10: Write a manufacturing plan for producing 60 aluminium spacers. Each spacer is 6.5 cm long, 3.0 cm wide and 1.0 cm thick, with a central hole of 0.5 cm diameter. The spacers are to be produced in batches of 60 from solid aluminium blanks measuring 6.8 cm by 3.2 cm by 1.2 cm. In your plan include: material and stock, sequence of operations (mark out, cut, drill, debur, finish), equipment, rough times for each operation, quality checks and tolerances, and safety considerations.",
    "hint": "Think about the order of operations and the checks you would perform to make sure every spacer is correct.",
    "working": [
      "Agree achievable tolerances and supervised manufacturing methods before starting.",
      "Provisional times per part: marking 1 minute, sizing 4, drilling 1, deburring 0.5, finishing 1 and inspection 1: 8.5 minutes.",
      "For 60 parts the provisional operation total is 510 minutes, plus setup and packaging. Confirm these estimates with a timed first piece."
    ],
    "answer": "Use the supplied aluminium blanks. Agree tolerances before manufacture; proposed classroom targets are ±0.1 cm on external dimensions and ±0.05 cm on the hole diameter, subject to the design's fit requirements.\n\nMark out, then bring each blank to 6.5 x 3.0 x 1.0 cm using a suitable supervised cutting and sizing process. Check the finished faces before locating the hole centre 3.25 cm from an end and 1.5 cm from a side. Centre-mark, clamp securely and drill the 0.5 cm hole. Deburr, finish and inspect. Batch the operations, with a first-piece check at each stage. Use suitable measuring tools, a vice or clamps, guarded cutting equipment, a pillar drill and appropriate finishing tools.\n\nProvisional times per part are marking 1 minute, sizing 4, drilling 1, deburring 0.5, finishing 1 and inspection 1: 8.5 minutes, or 510 minutes for 60. Setup and packaging are additional; verify estimates with a trial.\n\nWear eye protection, secure hair and loose clothing, and keep guards in place. Do not wear gloves near rotating machinery. Stop the machine before removing swarf with a suitable brush or tool. Inspect all dimensions, hole position and edges; separate rejected parts and collect metal waste according to workshop procedures.",
    "notation": false
  },
  "y9-design-technology-product-analysis-and-improvement/practice-8-Edexcel-core": {
    "question": "Question 9: Propose justified improvements A reusable plastic lunch box measures 20 cm long, 12 cm wide and 6 cm high. It weighs 320 g when empty. The box is used to carry a sandwich, a yoghurt pot and a small drink, with typical contents weighing about 420 g. The lid is held shut with a simple clip mechanism and a thin silicone ring around the edge. After two years of use, the hinges show wear and the lid leaks when carried in a bag. Propose two justified improvements to address these issues, explaining how each improvement would improve the product and what the possible effects on cost and manufacture would be.",
    "hint": "Think about fixing the leak and improving hinge durability; pick improvements that are feasible to produce.",
    "working": [
      "Investigate leakage and hinge wear separately, including whether wear affects lid alignment.",
      "Replace or redesign the existing thin silicone ring and its seating groove, then test compression and leakage.",
      "Trial a more durable hinge that maintains alignment, then test repeated opening and closing.",
      "Compare extra parts, tooling, assembly and repair implications before claiming a cost benefit."
    ],
    "answer": "First, redesign the existing silicone ring and groove, or make the ring replaceable, so a worn seal can be renewed and compressed consistently. This may require new tooling and seal-fitting work; leak testing after repeated use is needed. Second, trial a durable pin hinge with suitable alignment and protected pinch points. This could reduce hinge wear but adds parts and assembly operations and may complicate cleaning. Compare lifecycle tests and actual supplier costs before deciding whether either improvement is affordable or effective.",
    "notation": false
  },
  "y9-design-technology-programmable-control/exam-9-Edexcel-core": {
    "question": "Write pseudocode for a classroom conveyor simulation. Read START, STOP and OBSTACLE once per loop; 1 means active. STOP has priority: on its next input check set MOTOR and LED to 0. Otherwise an obstacle stops the motor. On each new obstacle detection, flash the LED on for 0.5 s and off for 0.5 s for 3 s, then leave it off while the obstacle remains. If the obstacle clears, normal control resumes. With neither STOP nor OBSTACLE active, MOTOR and LED follow START. Use a continuously checked clock, not blocking waits. This simulation is not an emergency-stop design for machinery.",
    "marks": 4,
    "markScheme": [
      "Checks all inputs repeatedly and gives STOP priority.",
      "Detects a new obstacle and records its start time without a blocking delay.",
      "Uses elapsed time to flash for three seconds and then leaves the LED off while the obstacle persists.",
      "With neither overriding input active, MOTOR and LED follow START."
    ],
    "answer": "```text\nwasObstacle = false\nflashStart = 0\nLOOP FOREVER\n    READ START, STOP, OBSTACLE\n    now = clockSeconds()\n    IF STOP == 1 THEN\n        MOTOR = 0\n        LED = 0\n        wasObstacle = false\n    ELSE IF OBSTACLE == 1 THEN\n        MOTOR = 0\n        IF wasObstacle == false THEN\n            flashStart = now\n        END IF\n        elapsed = now - flashStart\n        IF elapsed < 3 AND FLOOR(elapsed / 0.5) MOD 2 == 0 THEN\n            LED = 1\n        ELSE\n            LED = 0\n        END IF\n        wasObstacle = true\n    ELSE\n        wasObstacle = false\n        MOTOR = START\n        LED = START\n    END IF\nEND LOOP\n```\nThere are no waits inside the loop. STOP is handled on the next input check; releasing STOP with an obstacle still present starts a fresh warning interval.",
    "notation": false
  },
  "y9-design-technology-programmable-control/practice-5-AQA-core": {
    "question": "Question 6 (Test an interactive prototype) You have built a small interactive prototype for a door-entry system using a microcontroller. When the push button is pressed, a 4-LED sequence should light in the order 1-2-3-4, with each LED lit for about 0.5 seconds. You test the prototype eight times. In six tests the LEDs light in the correct order and duration; in two tests the sequence is not correct. Calculate the proportion of tests that were successful as a decimal and as a percentage.",
    "hint": "Use the number of successful tests divided by the total number of tests.",
    "working": [
      "Total tests = 8",
      "Successful tests = 6",
      "Proportion = 6 ÷ 8 = 0.75",
      "Percentage = 0.75 × 100 = 75"
    ],
    "answer": "6 ÷ 8 = 0.75, equivalent to 75% of tests.",
    "notation": false
  },
  "y9-english-comparison/exam-0-Edexcel-core": {
    "question": "Question 1 (4 marks) Summarise across texts: Text A and Text B. The two texts present different views on plastic bags. Read both texts and write a clear, concise summary of each writer's viewpoint in your own words, showing how the writers' views are similar or different. Include key evidence from both texts to support your summary. Text A: Plastic bags are a practical and inexpensive option for shoppers. Banning them would not stop litter; it would just create more inconvenience and higher costs for both customers and shops, who would have to buy alternatives. Keeping plastic bags makes everyday life easier and supports local retailers. Text B: Plastic bags harm the environment; they litter streets, pollute seas and threaten wildlife. We should reduce their use by banning free bags or charging a small fee, and by making reusable bags affordable for everyone.",
    "marks": 4,
    "markScheme": [
      "Gives an overall, accurate summary of both texts' viewpoints in own words",
      "Paraphrases key points from Text A, showing its main argument",
      "Paraphrases key points from Text B, showing its main argument",
      "Identifies similarities and differences between the writers' viewpoints and suggested solutions"
    ],
    "answer": "Text A argues that plastic bags are a practical and inexpensive option for shoppers, and that banning them would cause inconvenience and higher costs for both customers and shops, who would need to buy alternatives; it also suggests that keeping plastic bags supports everyday life and local retailers. Text B argues that plastic bags harm the environment by littering streets and polluting seas, and it supports reducing use through banning free bags or charging a small fee while making reusable bags affordable for everyone. Overall, Text A focuses on practicality and cost, while Text B focuses on environmental harm and policy changes; both express concern about the impact of plastic bags, but they propose different solutions.",
    "notation": false
  },
  "y9-english-comparison/exam-4-AQA-core": {
    "question": "Question 5: Read Extract A and Extract B. They discuss school uniform. Compare how the writers structure their arguments to present their viewpoints about school uniforms. In your answer, compare: the order and development of ideas; paragraphing and linking between ideas; how sentences create different effects and guide the reader; and any rhetorical devices or tonal shifts that influence the reader. Support your answer with close references to both extracts.\n\nEXTRACT A: On my first morning at secondary school I stood in a blazer that reached past my knuckles, and my mother said I would grow into it, which I eventually did. What I did not expect, in all the years that followed, was how little I thought about what I was wearing, and how much that turned out to be worth. There were no labels to notice, no weekly reckoning of who could afford what, and no morning spent deciding. A uniform is not about smartness, whatever the prospectus says. It is about removing one question from a day that has quite enough questions in it already.\n\nEXTRACT B: School uniform does not create equality. It hides it. The shoes still differ. The coats still differ. Everyone still knows. Meanwhile we spend our mornings measuring skirts and counting stripes on a tie, and we call this preparation for the world of work. Which workplace? Ask any adult when they last had their collar inspected. What uniform teaches is not smartness or belonging. It is that rules exist to be obeyed rather than understood, and that is a strange first lesson for a school to offer.",
    "marks": 6,
    "markScheme": [
      "Explains A’s movement from a personal memory to a broader defence of uniform.",
      "Uses accurate evidence from A to explain its structure.",
      "Explains how A’s repeated negatives accumulate practical benefits.",
      "Explains B’s blunt opening and repeated short sentences challenging equality.",
      "Uses B’s actual rhetorical questions to explain its challenge to school authority.",
      "Makes a supported comparison of the writers’ different structural methods."
    ],
    "answer": "A begins with a personal memory of an oversized blazer, then shifts towards the benefit of thinking less about clothes. The sequence “no labels”, “no weekly reckoning” and “no morning spent deciding” accumulates practical advantages. The ending moves from individual experience to a general claim about removing an unnecessary question from the school day.\n\nB instead opens with a blunt rejection of the equality argument. Repeated short sentences about shoes and coats challenge that claim through familiar details. “Which workplace?” and the invitation to ask an adult then question the justification for inspections. Its ending broadens the attack from clothing to unquestioning obedience. A gradually builds a reflective defence; B uses repetition and challenges to dismantle one.",
    "notation": false
  },
  "y9-english-comparison/exam-8-AQA-core": {
    "question": "Compare how language and structure present attitudes to homework in these two original teaching passages. Use evidence from both and evaluate their effects.\n\nPassage A: After dinner, homework becomes a friendly routine. I open my book and follow the questions like a quiet map, finding one small step that leads to the next. When an answer finally works, I feel proud.\n\nPassage B: More homework. It piles up and never ends. I am worn out, boxed in by pages while the evening disappears. Another question. Another crossed-out answer. When do I get to stop?",
    "marks": 6,
    "markScheme": [
      "Identifies a positive language choice in Passage A (e.g. \"friendly routine\", \"quiet map\") and explains how it makes homework seem beneficial",
      "Explains how Passage A uses the first-person perspective to create empathy and align the reader with the writer's viewpoint",
      "Describes how Passage A's sentence length and rhythm create a calm, routine feel that reinforces its message",
      "Identifies negative, emotive language in Passage B (e.g. \"piles up\", \"worn out\", \"boxed in\") and explains how it conveys frustration",
      "Explains how Passage B uses shorter, punchier sentences to convey tiredness or constraint and strengthen the negative view",
      "Provides an overall comparison of how the two writers' methods shape the reader's understanding and judges which is more effective in conveying its viewpoint"
    ],
    "answer": "A’s metaphor “quiet map” presents homework as guidance, while the movement from opening the book to feeling “proud” gives the activity a reassuring outcome. Its longer central sentence follows gradual progress. In B, “boxed in” suggests confinement, and the fragments “Another question. Another crossed-out answer.” create a repetitive, frustrated rhythm. The final question leaves that frustration unresolved. Both first-person accounts make attitudes personal: A emphasises achievement, whereas B emphasises pressure. Each is effective for its stated viewpoint; neither alone establishes how all pupils feel.",
    "notation": false
  },
  "y9-english-essay/exam-1-Edexcel-core": {
    "question": "Read the extract below. In an analytical essay, embed concise evidence from the extract to show how the writer presents Mia's attitude to risk as she climbs a hill to deliver a letter. Use at least two brief quotes from the extract and explain the effect of each, and ensure your answer is approximately 150–200 words. On the hill path, the wind whipped at her scarf and the ground slipped with damp leaves. Mia paused, counting breaths before stepping forward. Each tremor of the earth reminded her that failure would not just mean a bad grade, but letting down those who depended on the mail she carried. When a branch snapped overhead, she did not flinch. Instead she pressed on, thinking, 'I can’t give up; they’re counting on me.' At the top, the village lay quiet, and for a moment she felt as small as a pea in a giant world. Then she steadied herself, pulled the envelope from her jacket, and whispered that she would reach the door before the sun dipped below the ridge.",
    "marks": 6,
    "markScheme": [
      "Identifies a clear example of Mia facing risk from the extract.",
      "Uses embedded quotation as evidence to support the point.",
      "Explains how language choices (wind, damp leaves, branch) convey risk.",
      "Explains effect on reader's understanding of Mia's attitude to risk.",
      "Demonstrates smooth, correct embedding of quotes with punctuation.",
      "Maintains focus on the question and presents a coherent analysis."
    ],
    "answer": "The writer presents Mia’s attitude to risk as a cautious but determined choice to act for others. The sensory details of danger establish the stakes: \"the wind whipped at her scarf\" and \"the ground slipped with damp leaves,\" which signal instability and make the climb feel risky. Yet Mia’s response is resolute, shown when she thinks, \"I can’t give up; they’re counting on me,\" revealing that her motivation is responsibility and care for others, not fear. The moment she does not flinch when \"a branch snapped overhead\" further demonstrates a calm, deliberate courage in the face of danger. The combination of danger and focus on duty makes her attitude appear brave but measured, as she moves from breathless hesitation to steady progress, culminating in the decision to reach the door before sunset. The writer therefore uses concise evidence and straightforward language to portray risk as a challenge that Mia accepts for the sake of others, highlighting her resilience without glorifying recklessness.",
    "notation": false
  },
  "y9-english-essay/exam-4-AQA-core": {
    "question": "Read the extract below. In about 200–240 words, write a well-structured analytical paragraph explaining how the writer uses language to create mood and to reveal Maya's feelings in this moment. You should refer to imagery, sound and sentence structure, and support your analysis with close quotation from the extract. Extract: Evening had pressed its purple into the sky when Maya reached the old park. The bench stood under a tired streetlamp, its paint flaking like old news. A thin rain fell, not enough to be a shower, but enough to soften the sounds of the town. The path was lined with trees that whispered as the wind moved through them, and Maya could feel the night listening to her footsteps. She counted the seconds between distant car engines, each one stretching longer than the last. A fox appeared near the hedge, paused, and then slipped away, as if it knew a secret the town forgot. The air smelled of damp earth and something metallic, like coins left in pockets until the morning. For a moment, Maya felt small, part of a bigger map, and yet oddly unimportant, as a page waiting to be turned.",
    "marks": 6,
    "markScheme": [
      "Identifies at least one technique and explains how it contributes to mood or Maya’s feelings.",
      "Notes how imagery of weather/setting creates a particular mood and mirrors Maya’s state.",
      "Discusses personification or auditory imagery (trees whispering; night listening) and its atmospheric effect.",
      "Analyses a sensory detail (smell or texture) and its impact on mood and realism.",
      "Considers sentence structure or pacing (sequences of actions, pauses) to show inner state or tension.",
      "Shows an overall understanding of Maya’s emotional complexity using quotation from the extract to support points."
    ],
    "answer": "The writer creates a reflective, slightly uneasy mood through a setting that seems to respond to Maya. The personified “tired streetlamp” suggests weariness, while paint “flaking like old news” connects physical decay with something once significant but now overlooked. This may reflect Maya’s later feeling of being “oddly unimportant”, although the passage does not establish a particular unhappy memory. Sound makes the setting intimate: the trees “whispered” and the night appears to be “listening to her footsteps”. These personifications suggest that Maya is unusually aware of her surroundings, almost as if she is being observed. The rain “soften[s] the sounds”, drawing attention towards quieter details rather than dramatic action. The long sentence describing the trees links their movement to Maya’s response, allowing the atmosphere to develop gradually. By contrast, the fox’s sequence of actions, “appeared”, “paused” and “slipped away”, creates a brief moment of suspense before returning the park to stillness. Its apparent secret adds uncertainty without explaining what Maya is waiting for. Finally, the image of a “page waiting to be turned” presents her as unfinished or expectant. Alongside feeling part of a “bigger map”, it suggests tension between belonging to the world and feeling insignificant within it. The mood therefore remains contemplative rather than wholly comforting.",
    "notation": false
  },
  "y9-english-essay/practice-2-AQA-core": {
    "question": "Question 3 — Read the two short paragraphs below and answer: How does the writer link ideas across Paragraph 1 and Paragraph 2 to develop the argument about the impact of phone use on learning? Identify two devices that connect and develop the ideas within or across these paragraphs, and explain the effect of each device on the overall argument. Paragraph 1: Many students argue that smartphones can help learning because they provide instant access to information during lessons. They say a quick search or a maths app can speed things up and support understanding. However, in many classes phones also distract pupils: messages buzz, games load, and attention drifts away from tasks. Paragraph 2: As a result, the school tightened the policy so phones can be used only during breaks. In lessons, teachers report calmer behaviour and more focused work. Some pupils say they feel able to concentrate better and take clearer notes.",
    "hint": "Look for a contrast word and a consequence phrase, and for a pronoun or noun that refers back to earlier ideas.",
    "working": [
      "“However” introduces the contrast within Paragraph 1 between possible benefits and distraction.",
      "“As a result” connects those distractions to the policy response at the start of Paragraph 2.",
      "The repeated references to phones and lessons keep the argument focused on the same issue."
    ],
    "answer": "“However” shifts Paragraph 1 from potential benefits to problems, preparing the reason for a policy change. “As a result” explicitly links those problems to the response in Paragraph 2. The argument therefore develops from competing effects towards a claimed consequence; the phrase “these distractions” is not in the passage and should not be quoted.",
    "notation": false
  },
  "y9-english-essay/practice-2-Edexcel-core": {
    "question": "In the two short paragraphs provided, analyse how the writer links ideas from Paragraph 1 to Paragraph 2 to build the argument that talking through ideas helps understanding. Refer to the linking devices used, such as repeated ideas, pronoun references, and linking words.\n\nParagraph 1: We begin by listing our ideas and sharing them with a partner. Saying an idea aloud can reveal a gap that was easy to miss when it stayed in our heads.\n\nParagraph 2: We then connect these ideas using words such as “because”, “so” and “therefore”. This process helps us explain why one point follows another, rather than presenting a disconnected list.",
    "hint": "Look for how repeating the idea of listing ideas and the explicit mention of link words in Paragraph 2 connect the two paragraphs.",
    "working": [
      "Step 1: Paragraph 1 introduces the method of listing ideas and sharing them, which creates a pattern the writer can carry forward.",
      "Step 2: Paragraph 2 repeats the same approach and names linking words ('because', 'so', 'therefore'), signalling a continuation of the link from Paragraph 1 to Paragraph 2.",
      "Step 3: Pronoun references such as \"we\" keep the discussion cohesive and maintain the sense that the same group is making the argument across both paragraphs.",
      "Step 4: These linked devices guide the reader and strengthen the claim that talking through ideas improves understanding."
    ],
    "answer": "The writer links Paragraph 1 to Paragraph 2 by repeating the method of listing ideas and then connecting them, and by using explicit linking words ('because', 'so', 'therefore') and the pronoun \"we\" to maintain cohesion, which helps the reader see how talking through ideas strengthens understanding.",
    "notation": false
  },
  "y9-english-novel/exam-2-AQA-core": {
    "question": "Read the following extract, written to evoke a 19th-century setting. Extract: The lamplighter's glow crawled along the muddy street as a boy, with patched coat and shoes, watched a grand carriage pass by. The rider waved to a friend and laughed, and the boy thought: if wealth were a map, his own footsteps would always point to the edge of the map, where the houses grew poorer and the doors grew forever closed. In the cold air, the boy's breath fogged and a distant church bell tolled, as if the world paused before the rich and the poor. Develop a critical argument about how the writer presents the tension between social class and personal ambition in this extract. In your answer, consider how language choices, imagery, sentence structure and the voice of the narrator shape the reader's view of the boy's situation.",
    "marks": 6,
    "markScheme": [
      "Develops a sustained, clearly focused argument about how class and ambition are positioned and opposed in the extract",
      "Uses precise evidence from the extract to support points",
      "Analyses language choices (e.g., 'patched', 'grand', 'doors grew forever closed') and explains their effects on the reader",
      "Analyses imagery and symbolism (lamplight, fog, bell) and connects to mood, setting and social division",
      "Explains how sentence structure and the narrator's voice create pacing and perspective that influence interpretation",
      "Reaches a coherent conclusion about the writer's stance on social inequality and ambition."
    ],
    "answer": "The extract places a boy with a patched coat beside a grand carriage, establishing an immediate contrast between poverty and wealth. The line \"if wealth were a map, his own footsteps would always point to the edge of the map, where the houses grew poorer and the doors grew forever closed\" frames ambition as a navigational tool that cannot cross the boundaries of class; the metaphor of a map makes wealth an authoritative guide while the boy's path remains restricted by social doors \"forever closed.\" The imagery of the lamplighter's glow and the cold breath of the boy creates a bleak mood that highlights his vulnerability. The distant church bell tolls, suggesting a world indifferent to the individual's desire for improvement. The long sentence moves from the carriage to the boy’s thought, then extends the map metaphor through successive clauses. This draws the reader into his sense of exclusion and makes the barriers to ambition seem persistent. The narrator's voice appears empathetic towards the boy, inviting the reader to question the fairness of the social system. Through these techniques, the writer develops a critical viewpoint: social class structures shape opportunities, and personal ambition is filtered through those structures rather than fully realised. In the final analysis, the extract critiques the rigid class divide by juxtaposing the boy's inner dream with the external barriers and by inviting the reader to empathise with him and question the social order.",
    "notation": false
  },
  "y9-english-speech/exam-7-AQA-core": {
    "question": "Question 8 (6 marks: use rhetoric deliberately) In the speech below, the speaker aims to persuade the audience. Read the excerpt and then answer: Identify three rhetorical devices used by the speaker and explain how each helps to persuade the audience. Use quotes from the speech to support your answer. Speech excerpt: Friends, listen to me. We stand at a crossroads, and the choice is ours. Do we stay quiet and let fear guide us, or do we speak out and claim our future? I say we speak. I say we act. If we all stand together, no wall is high enough to stop our voices. If we doubt ourselves, remember the faces of those who believed before us, who built a different tomorrow with hope, not fear.",
    "marks": 6,
    "markScheme": [
      "Identify anaphora with an accurate quotation.",
      "Explain how that repeated opening reinforces determination.",
      "Identify the crossroads metaphor with an accurate quotation.",
      "Explain how it makes the choice seem decisive.",
      "Identify direct address or inclusive language with an accurate quotation.",
      "Explain how it creates connection or shared purpose."
    ],
    "answer": "Anaphora: “I say we speak. I say we act.” The repeated “I say we” emphasises determination and gives the call to action a rhythmic insistence.\n\nMetaphor: “We stand at a crossroads.” Presenting a decision as a physical junction makes the moment seem significant and suggests that the audience must choose a direction.\n\nDirect address and inclusive language: “Friends, listen to me” and “our future” connect speaker and audience, making the appeal feel like a shared responsibility rather than a distant instruction.",
    "notation": false
  },
  "y9-english-transactional/exam-4-Edexcel-core": {
    "question": "Question 5 (6 marks) Adapt tone for a specified audience (Writing for Purpose and Audience). You have read the informal paragraph about a science trip below. Your task is to adapt the tone for a formal notice aimed at both parents and students of Year 9. Use the information in the passage but present it in a formal style and for this audience. Write between 150 and 180 words. Informal passage: 'Hey everyone! Just wanted to say how amazing last week's science trip was. We got to see a real lab and the guide showed us how different scientists test ideas. I loved when we did the quick experiments ourselves and compared results with the class. It was a bit long, but totally worth it. If you’re reading this, take more notes than you think you’ll need and don’t be afraid to ask questions.'",
    "marks": 6,
    "markScheme": [
      "The rewritten text uses a formal, respectful tone suitable for the audience.",
      "Language is appropriate for a Year 9 audience; no slang or casual phrases.",
      "The key information from the original passage is included (lab visit, guided explanation of testing ideas, hands-on experiments, comparison of results).",
      "The response communicates that the day was lengthy but worthwhile, framing it as a valuable learning experience.",
      "The response encourages note-taking and asking questions.",
      "The structure is clear and appropriate for a notice (greeting, body, closing) and uses suitable formal conventions."
    ],
    "answer": "Year 9 Science Visit: A Review\n\nFor parents and Year 9 students\n\nLast week’s science trip gave pupils an opportunity to visit a real laboratory and learn about the ways scientists test ideas. A guide explained the work, helping students connect scientific investigation with a practical setting.\n\nDuring the visit, pupils took part in short experiments and compared their results with those of other members of the class. This combination of explanation and participation was an important feature of the day. The original account describes the visit as lengthy but worthwhile, reflecting the value the pupil placed on the experience.\n\nStudents considering similar learning opportunities are encouraged to make detailed notes and ask questions. Recording more information than initially seems necessary can help when reviewing a visit afterwards; asking about unfamiliar ideas can also make explanations clearer.\n\nThank you to the students for sharing their reflections. This notice reports on the completed visit; it does not announce a future trip.",
    "notation": false
  },
  "y9-english-transactional/exam-7-Edexcel-core": {
    "question": "Write an article for the school magazine about reducing plastic waste in the canteen. You must use a formal register suitable for a general school audience and persuade readers to take action. Include a clear headline, a subheading, and at least three reasons to support your view, plus a short call to action at the end. Aim for 180-210 words.",
    "marks": 4,
    "markScheme": [
      "Uses a formal, suitable register for a school audience.",
      "Gives at least three persuasive reasons to reduce plastic waste.",
      "Proposes practical, realistic actions the school can take.",
      "Includes a clear structure with a headline, a subheading and a concluding call to action."
    ],
    "answer": "Reduce Plastic Waste in Our Canteen\nA practical change for our school community\n\nOur canteen should reduce avoidable plastic waste through a practical plan developed with students and staff. The aim should be to prevent unnecessary waste while keeping meals affordable and convenient.\n\nThere are three reasons to act. First, fewer disposable items would mean less material needing collection and disposal. Second, well-used refillable bottles and reusable containers could reduce repeated purchases, although cleaning and replacement costs must be considered. Third, clear routines would help students develop habits they can use beyond school.\n\nThe school could begin by counting the disposable items used during a typical week. Staff and students could then choose one manageable change, such as improving access to drinking-water refills. Any reusable container scheme should meet the canteen’s hygiene requirements and include an affordable option for pupils who cannot buy new equipment.\n\nClearly labelled bins would support correct sorting, but labels must match the local collection service. An item is not necessarily recyclable simply because it is plastic.\n\nPlease share suggestions with the Student Council and support a short trial. Measuring what changes will help the school decide which actions deserve to continue.",
    "notation": false
  },
  "y9-english-transactional/exam-8-AQA-core": {
    "question": "You are the editor of your school magazine and have been asked to write a feature about why our school should invest in improving study spaces for pupils. Your piece will be read by students, teachers and parents, so you must organise ideas coherently across five paragraphs: an introduction that states the purpose, three body paragraphs that present reasons and a counterpoint, and a concluding paragraph that sums up your argument. Use clear topic sentences and linking words to show the order of ideas, and ensure the writing is appropriate for a school audience. Write between 550 and 650 words.",
    "marks": 5,
    "markScheme": [
      "Planning shows clear order and logical structure across five paragraphs (introduction, three body paragraphs, conclusion).",
      "Each body paragraph has a clear topic sentence and develops a distinct idea with logical sequence.",
      "The writing uses cohesive devices and linking words to connect ideas between sentences and paragraphs.",
      "The argument is balanced, including a concise counterpoint or caveat and a response to it.",
      "The final paragraph effectively sums up the argument and reinforces the purpose for the intended audience."
    ],
    "answer": "A better place to study is a practical investment in school life. Pupils need somewhere to work independently, discuss projects and prepare for examinations without competing demands filling the same room. Improving our study spaces would not require an impressive new building before anything useful could happen. We could begin by examining how existing rooms are used and listening to the people who use them. Students, teachers and parents should help identify the most pressing problems and agree what a successful improvement would look like. My proposal is a carefully planned trial that combines quiet working, space for collaboration and a realistic approach to cost, with clear evidence collected before any wider expansion.\n\nFirstly, a designated quiet area could make independent work more manageable. Individual desks, suitable lighting and clear expectations about noise would give pupils a place to read, revise and concentrate. This matters particularly for those whose home circumstances make uninterrupted study difficult. Access should be fair, with opening times and booking arrangements explained clearly rather than left to chance. Comfortable furniture is useful, but expensive furniture is not the purpose: the aim is a dependable place where work can happen. We should also ask pupils with different access needs about routes, seating and distractions. A quiet room that some learners cannot comfortably enter or use would fail its purpose, however attractive it looked in a photograph.\n\nSecondly, collaborative work needs a different kind of space. Groups benefit from tables where everyone can see shared material and discuss ideas without disturbing students who need silence. Movable furniture could allow an existing room to serve several group sizes, provided routes remain clear and supervision is practical. A whiteboard might help pupils explain a method or organise a project, but equipment should be selected for an identified use. The important distinction is between purposeful discussion and uncontrolled noise. Keeping collaborative and quiet areas separate, or scheduling them at different times, would acknowledge that both forms of learning matter. Clear rules would help pupils choose the setting that suits the task they actually need to complete.\n\nHowever, a reasonable objection is that schools already face competing demands on money and staff time. A proposal for study spaces should answer that concern directly. Before buying anything, the school could review available rooms, existing furniture and supervision needs. A small trial in one suitable space would allow us to estimate costs and identify problems. We should avoid converting corridors or blocking exits simply because those areas appear unused. The trial could record attendance, gather feedback and check whether pupils can complete their intended tasks there. These measures would help us judge usefulness, although they would not by themselves prove that the space caused higher examination results. Expansion should depend on that review and an affordable plan.\n\nImproving study spaces deserves consideration because it addresses an everyday need through changes we can examine and refine. Quiet work, collaborative discussion and accessible facilities should be planned together, with their different requirements made clear. The next step is for the school to invite suggestions, identify one possible trial location and publish a modest proposal for discussion. Pupils should have a voice in that process, while staff assess practical constraints and parents can comment on access outside lesson time. We do not need to promise instant transformation to justify a useful improvement. We need a clear purpose, a fair trial and a willingness to learn from what happens.",
    "notation": false
  },
  "y9-english-transactional/practice-4-Edexcel-core": {
    "question": "Write a 150–180 word notice for the school noticeboard addressed to Year 9 students about a new after-school Debate Club. The notice should explain what the club is, when and where it meets (Tuesdays 3:15–4:15 pm in Library Study Room 4), who can join (Year 9 only, no experience necessary), what happens in a typical session, and how to sign up (sign up with Mrs Patel in Room 14 or by emailing ppatel@school.example). Use a formal but approachable register appropriate for peers. Include a sign-off line inviting attendees.",
    "hint": "Think about maintaining formality but friendly tone, and a simple call to action.",
    "working": [
      "Identify audience and decide on formal but approachable register.",
      "List the required details to include: what the club is, when/where, who can join, what happens, and how to sign up.",
      "Plan the structure: opening line introducing the club, body paragraphs with details, closing call-to-action.",
      "Draft in two to three short paragraphs with clear, direct sentences; avoid slang.",
      "Review to ensure consistency of register and clarity."
    ],
    "answer": "Notice: New After-School Debate Club\n\nA new Debate Club is starting after school for Year 9 students. The club will meet on Tuesdays from 3:15 to 4:15 pm in Library Study Room 4. It is open to all Year 9 pupils, whether you have debated before or you are new to debating.\n\nEach session will begin with a short warm-up, followed by practice debates and guidance on building arguments, using clear structure, and speaking confidently. No prior experience is required, and beginners are welcome. You will have the chance to speak on interesting topics, listen to others, and receive constructive feedback in a supportive environment.\n\nIf you would like to join, please sign up with Mrs Patel in Room 14 (the English corridor) or email ppatel@school.example. Please contact Mrs Patel if you have questions about taking part or would like further information before joining.\n\nWe hope you will give it a try and look forward to welcoming new members.",
    "notation": false
  },
  "y9-geography-climate-change/exam-8-AQA-core": {
    "question": "Compare mitigation and adaptation as responses to climate change, using the scenario for a coastal town below. The town currently emits 120 000 tonnes CO2e per year. It implements mitigation measures: a wind turbine project will cut emissions by 40 000 tonnes CO2e per year starting in year 2, and a home insulation programme will cut emissions by 10 000 tonnes CO2e per year starting in year 1. From year 2 onwards, total emission reductions from mitigation are 50 000 tonnes CO2e per year. It also implements adaptation measures: flood barriers along 3 km of coast costing £6 million; from the start of year 2, after completion at the end of year 1, annual flood damages fall from £1.2 million to £0.5 million (a saving of £0.7 million per year). The climate context includes a sea level rise of 0.25 m in 50 years, which increases flood risk. The town wants to reduce risk to residents and property in a cost-effective way. In your answer, compare the two approaches, including how each helps, two similarities and two differences, and an assessment of what the figures can and cannot establish about cost-effectiveness over years 1 to 50. For the calculation assume constant savings, no further costs and no discounting.",
    "marks": 6,
    "markScheme": [
      "1 mark: distinguishes mitigation reducing emissions from adaptation reducing vulnerability to impacts.",
      "1 mark: uses the stated mitigation and adaptation measures accurately.",
      "1 mark: gives two similarities, such as reducing climate-related risks and requiring resources or investment.",
      "1 mark: gives two differences, such as addressing emissions versus impacts and global climate effects versus direct local protection.",
      "1 mark: calculates 49 saving years x £0.7m = £34.3m, less £6m capital cost = £28.3m net saving under the stated assumptions.",
      "1 mark: explains that absent mitigation cost/benefit data prevent ranking the two approaches by cost-effectiveness."
    ],
    "answer": "Mitigation cuts emissions: the wind and insulation measures reduce annual emissions by 50,000 tonnes CO2e from year 2. Adaptation reduces exposure to consequences: barriers reduce local flood damage. Both address climate-related risks and require investment. They differ in targeting emissions versus impacts, and in global climate benefits versus direct local protection.\n\nThe barriers save £0.7m annually from year 2 through year 50: 49 x £0.7m = £34.3m. Subtracting the £6m capital cost gives £28.3m net saving under the simplified assumptions. Payback takes about 8.6 years of savings after completion. Mitigation costs and comparable monetary benefits are missing, so these data cannot establish which approach is more cost-effective. Both may be needed.",
    "notation": false
  },
  "y9-geography-climate-change/practice-0-AQA-core": {
    "question": "A simplified teaching dataset combines historical ice-core evidence and modern atmospheric measurements. It shows carbon dioxide rising from about 280 ppm around 1800 to about 420 ppm in the early 2020s. At one temperate forest site, tree rings have become narrower over the last 60 years. Explain what the evidence suggests and why these two observations alone do not provide a complete record of global temperature.",
    "hint": "Separate greenhouse-gas evidence from local evidence of tree growth; consider alternative influences on ring width.",
    "working": [
      "Rising atmospheric carbon dioxide strengthens the greenhouse effect and supports concern about further warming.",
      "Narrower rings indicate reduced growth at this site, which can result from water stress, temperature, competition, disease or other factors.",
      "Local tree-ring widths need calibration and supporting records before being interpreted as a temperature reconstruction."
    ],
    "answer": "The rise in carbon dioxide strengthens the greenhouse effect and supports expectations of further warming if concentrations continue to rise. Narrower tree rings show reduced growth at one site, but cannot on their own establish warming or cooling: rainfall, disease and competition can also affect growth. Temperature records and other calibrated climate evidence are needed to establish the scale and pattern of past warming.",
    "notation": false
  },
  "y9-geography-climate-change/practice-5-Edexcel-core": {
    "question": "Compare mitigation and adaptation as responses to climate change. In Seabright, a coastal town, two actions are planned: (a) Mitigation: to cut greenhouse gas emissions by 12% over the next 10 years by switching to renewable energy and improving energy efficiency, at a cost of £450,000 per year. (b) Adaptation: to reduce flood risk by building a sea wall 1.5 km long and upgrading drainage at a total upfront cost of £2,000,000. Using this information, explain two differences between mitigation and adaptation in terms of aims and actions, and assess which strategy is more cost-effective for reducing flood risk in Seabright over the next 20 years. Include a brief calculation of total cost for each option over 20 years, and note any assumptions you use.",
    "hint": "Think about whether reducing emissions now affects the future climate differently from protecting a town from floods.",
    "working": [
      "Step 1 – Mitigation aims to reduce climate change by lowering greenhouse gas emissions; Seabright’s mitigation plan is a 12% reduction over 10 years, costing £450,000 per year.",
      "Step 2 – Adaptation aims to reduce vulnerability to climate impacts by preparing for effects; Seabright’s adaptation plan is a sea wall 1.5 km long with drainage upgrades, costing £2,000,000 upfront.",
      "Step 3 – Assuming the annual mitigation programme continues for all 20 years, total mitigation cost = £450,000 × 20 years = £9,000,000.",
      "Step 4 – Total adaptation cost over 20 years = £2,000,000 upfront (assumes no additional costs for 20 years).",
      "Step 5 – Compare costs: £9,000,000 for mitigation vs £2,000,000 for adaptation; adaptation is cheaper over 20 years.",
      "Step 6 – Other considerations: mitigation offers global climate benefits by reducing emissions, while adaptation provides immediate local protection; both strategies have a role in reducing risk.",
      "Step 7 – Conclusion: For reducing flood risk in Seabright over the next 20 years, adaptation has the lower stated cost; quantified flood-risk benefits are missing, so cost-effectiveness cannot be ranked; mitigation remains important for longer-term climate goals."
    ],
    "answer": "Assuming the mitigation programme continues at £450,000 annually for all 20 years, its cost is £9m. If adaptation has no further maintenance or replacement costs, its stated cost is £2m. Adaptation is therefore cheaper under these assumptions and directly targets local flood risk. Mitigation reduces emissions and contributes to limiting future climate change. Cost alone does not establish cost-effectiveness: the amount of flood damage prevented by each option is not supplied.",
    "notation": false
  },
  "y9-geography-geographical-enquiry/exam-8-AQA-core": {
    "question": "Question 9 (Evaluate methods and conclusions): A Year 9 Geography class investigates whether urban heat is higher in the city centre than in a park. They use two methods: (i) measuring air temperature with a digital thermometer at 12:00 on three sunny days at four sites: city centre, residential street, park and school courtyard; (ii) asking 20 pedestrians to rate how hot it felt at each site on a scale from 1 (not hot) to 5 (very hot) at 12:00 on Day 2. Temperature readings (in °C) are: Day 1 – City centre 28.0, Park 25.5, Residential 27.0, School 27.5; Day 2 – City centre 28.5, Park 25.0, Residential 27.5, School 28.0; Day 3 – City centre 28.2, Park 26.0, Residential 27.0, School 27.8. Comfort ratings (out of 5) from 20 pedestrians on Day 2 are: City centre 4.0, Park 2.5, Residential 3.0, School 3.2. Evaluate the methods and the conclusions drawn from these data.",
    "marks": 6,
    "markScheme": [
      "The answer recognises that combining objective temperature data with subjective comfort ratings helps triangulate conclusions.",
      "It notes that measurements were taken at the same time (12:00) on three sunny days, aiding comparability, but the small number of days and limited times restricts reliability.",
      "It highlights that only four sites limit representativeness and may introduce site-selection bias.",
      "It points out that temperature readings do not capture shade, wind, or humidity, which can affect how hot people feel and the interpretation of heat stress.",
      "It evaluates the conclusion as plausible (city centre hotter than park across readings and ratings) but not robust due to data gaps and potential confounding factors.",
      "It suggests improvements: more times of day, more days, more sites, include wind and humidity data, and collect comfort ratings across multiple days to strengthen conclusions."
    ],
    "answer": "The data indicate the city centre is consistently warmer than the park: average temperatures across the three days are higher in the city centre than in the park (28.23°C for the city centre and 25.50°C for the park), and comfort ratings follow the same pattern (city centre 4.0 vs park 2.5). The triangulation with subjective ratings supports the temperature data, but several limitations weaken the strength of the conclusions. Measuring at 12:00 on only three days on four sites means the sample may not represent typical conditions (weather may vary day-to-day; no data from morning or afternoon). Only four locations limit how well the results apply to the whole city; selection bias could occur if sites were chosen for convenience rather than representativeness. Temperature readings do not account for shade, wind, or humidity, all of which influence perceived heat and could alter conclusions. The 20 pedestrians’ ratings are subjective ordinal scores and collected on Day 2 only, so they may reflect a temporary impression rather than a consistent pattern. Therefore, while the conclusion that the city centre tends to be hotter is reasonable given the data, it is not robust and should be treated as an indication rather than a definitive finding. To improve confidence, repeat measurements across more days and times of day, include humidity and wind data, increase the number of sites, and gather comfort ratings on multiple days.",
    "notation": false
  },
  "y9-geography-geographical-enquiry/practice-0-Edexcel-core": {
    "question": "Design a geographical enquiry question for a Year 9 field study that you could carry out in your local area. Your plan should include the aim, the data you would collect (types and units), the method you would use to collect the data (simple steps), how you would present your findings (for example a simple table or bullet list), and a brief justification of why this enquiry is suitable for Year 9. The route should be about 1 km long and divided into five equal 200 m segments, and you should count litter items in each segment.",
    "hint": "Think about something you can observe on a short walk near school, such as litter, traffic or the use of green space.",
    "working": [
      "Step 1: Choose a simple, observable local issue to investigate (for example, litter along a 1 km street).",
      "Step 2: Plan a route about 1 km long and divide it into five 200 m segments (0-200 m, 200-400 m, 400-600 m, 600-800 m, 800-1000 m).",
      "Step 3: Decide data to collect: the number of litter items found in each 200 m segment; Units: items per segment.",
      "Step 4: Data collection method: walk the route and count all litter items in each 200 m segment; record the counts in a simple table.",
      "Step 5: Presentation: create a table with columns for Start distance from the start of the route (m) and Litter items (count) for each segment.",
      "Step 6: Justification: This enquiry is suitable for Year 9 because it uses straightforward, quick data collection, relates to the local environment, and can be completed in one lesson with no specialist equipment."
    ],
    "answer": "A designed enquiry that could be used by students: How does the amount of litter vary along a 1 km stretch of the town centre high street, measured in five 200 m segments (0-200 m, 200-400 m, 400-600 m, 600-800 m, 800-1000 m)? Aim: To compare litter counts at each segment. Data to collect: Number of litter items counted in each 200 m segment (units: items). Method: Walk the 1 km route and count all litter items in each 200 m segment; record the counts in a table with the start distance (m) and litter items. Presentation: Use a simple table to show Start distance (m) and Litter items. Justification: Quick, simple data collection that relates to a local area and can be completed in one lesson, requiring only basic counting and no specialist equipment.",
    "notation": false
  },
  "y9-geography-geographical-enquiry/practice-1-Edexcel-core": {
    "question": "Question 2 – Collect and present data. During a 10-minute street survey near your school you counted the number of pedestrians using three different paths: Path 1 = 24, Path 2 = 18, Path 3 = 30. Explain two appropriate ways to present these results in your field notebook, and justify which is best for comparing the popularity of the paths.",
    "hint": "Think about which presentation makes the differences between the paths easy to compare.",
    "working": [
      "Step 1: The data are counts (numerical) for three different paths, so suitable presentation methods include a bar chart or a simple data table.",
      "Step 2: If you use a bar chart, label the x-axis as Path 1, Path 2, Path 3 and the y-axis as Number of pedestrians; give the chart a clear title.",
      "Step 3: A simple data table would list Path 1 – 24; Path 2 – 18; Path 3 – 30.",
      "A bar chart makes the relative counts easy to compare visually. Read exact counts from the axis or data labels, or use the table for precise values."
    ],
    "answer": "A table with headings Path and Pedestrians would record the exact counts: Path 1, 24; Path 2, 18; Path 3, 30. A bar chart would show three separate bars with paths on the horizontal axis and pedestrian count on the vertical axis, starting at zero. I would choose the bar chart for quick visual comparison: Path 3 is highest and Path 2 lowest. The table is useful when exact values need to be read.",
    "notation": false
  },
  "y9-geography-geographical-enquiry/practice-5-Edexcel-core": {
    "question": "A Year 9 geography class investigates whether proximity to the town park influences how often people use the park. They collect data in two ways: (a) counting the number of people entering the park at the entrance during four 15‑minute periods on one Saturday: 09:00–09:15 = 28 people, 11:00–11:15 = 42 people, 13:00–13:15 = 35 people, 15:00–15:15 = 50 people. (b) giving a short survey to 20 park users during that day, asking “How often do you visit this park in a typical week?” Results: 4 visit daily, 10 visit 2–3 times a week, 6 visit once a week or less. The class concluded: “The park is heavily used on Saturdays, and the area near the park has many visitors.” Evaluate the methods used and the conclusion. Suggest improvements.",
    "hint": "Was distance from home measured? Consider sampling times, non-users and the basis for calling use heavy.",
    "working": [
      "The periods include afternoon times and cover only one Saturday.",
      "The enquiry asks about proximity but records no home-to-park distance.",
      "Twenty current users exclude non-users and may be unrepresentative.",
      "Counts alone do not define heavy use without a comparison or criterion.",
      "Repeat sampling across days, record approximate distance bands and visit frequency, and include non-users using a suitable sampling plan."
    ],
    "answer": "The counts describe entry during four short periods on one Saturday, not typical Saturday use or use of the surrounding area. Calling it heavy needs a comparison or stated criterion. More importantly, no distance-from-home data were collected, so the enquiry cannot test whether proximity influences visit frequency. The survey of 20 current users also excludes people who do not visit. Repeat counts at comparable times on several days and survey a broader sample, using approximate distance bands and visit frequency without collecting unnecessary identifying details. A relationship between distance and frequency would still not by itself prove causation.",
    "notation": false
  },
  "y9-geography-water-food-and-energy/exam-2-AQA-core": {
    "question": "Question 3. In a farming region, water scarcity during a 4-month dry season threatens crop yields. The government is weighing two management options to reduce water stress over the next 15 years. Option A is to build a reservoir that can store 600 million litres and deliver up to 5 million litres per day during the dry season, at a capital cost of £420 million. Option B is to install drip irrigation on 1,800 hectares of farmland at a cost of £2,400 per hectare (total cost £4.32 million), which would reduce water use on those fields by 40% during the dry season. Evaluate which option is more effective at addressing water scarcity, considering economic, social, and environmental factors. Use only the information given above.",
    "marks": 6,
    "markScheme": [
      "Compare the £420m capital cost with the £4.32m irrigation cost.",
      "Explain the stated 40% demand reduction on 1,800 hectares without inventing baseline litres.",
      "Recognise that a full 600m-litre reservoir could supply 5m litres daily for 120 days if there were no losses or other withdrawals.",
      "Explain that refill, demand and losses are unknown, so capacity does not guarantee reliable supply.",
      "Recognise that social distribution, ecological impacts and ongoing costs are not supplied.",
      "Give a conditional judgement and identify evidence needed to compare effectiveness over 15 years."
    ],
    "answer": "B has much lower initial cost: £4.32 million compared with £420 million, and reduces use by 40% on 1,800 hectares. The original water use is unknown, so the actual litres saved cannot be calculated. A stores 600 million litres, enough for 120 days at 5 million litres per day only if initially full and with no losses or other withdrawals. Refill, losses and total demand are not specified, so reliable supply throughout every four-month season is not guaranteed.\n\nThe data identify benefits to the participating farmland but do not establish distribution across households or farms. They also provide no measured ecological impacts, running costs or maintenance costs over 15 years. I would provisionally favour B for its lower initial cost and stated demand reduction, while seeking that missing evidence. The supplied information cannot establish a complete social, environmental or long-term effectiveness ranking.",
    "notation": false
  },
  "y9-geography-water-food-and-energy/exam-4-AQA-core": {
    "question": "Riverland is a country with a population of 5 million people. Daily water demand is 850 million litres, but rivers and groundwater currently provide 700 million litres per day. The government is considering three strategies to increase supply: Strategy A: Build a coastal desalination plant to provide 150 million litres per day. It would cost £500 million to build and £25 million per year to run. Strategy B: Expand rainwater harvesting and reservoirs to provide 120 million litres per day. It would cost £200 million to implement and have running costs of £2 million per year. Strategy C: Treat and recycle wastewater to provide 100 million litres per day. It would cost £150 million to install and £10 million per year to run. Using only the information above, evaluate which combination of strategies would most effectively increase Riverland's supply to meet demand. Consider social, economic and environmental factors in your answer.",
    "marks": 6,
    "markScheme": [
      "Identifies the shortfall of 150 million litres per day.",
      "A alone supplies 150, bringing total supply to 850.",
      "Neither B nor C alone closes the gap.",
      "B plus C supplies 220, bringing total supply to 920.",
      "Compares B plus C costs (£350 million capital and £12 million annually) with A (£500 million and £25 million annually).",
      "Reaches a conditional judgement and identifies missing evidence on reliability, timing and social/environmental effects."
    ],
    "answer": "The shortfall is 850 − 700 = 150 million litres per day. A alone meets it, giving total supply of 850, at £500 million capital cost and £25 million annual running cost. B and C individually are insufficient. Together, B and C add 120 + 100 = 220, giving 920 million litres per day, with combined capital cost £350 million and annual running cost £12 million. On the supplied capacity and cost figures, B plus C is a strong choice. A plus B would give 970 and A plus C would give 950, but both cost more. No completion dates are given, so we cannot claim A is quickest. Reliability in drought, treatment requirements, land impacts and public acceptance need investigation before a final decision.",
    "notation": false
  },
  "y9-geography-water-food-and-energy/practice-9-Edexcel-core": {
    "question": "In Mapton, the Coastal Region has a population of 120,000 people and 24 wells for drinking water, while the Inland Region has a population of 150,000 people and 12 wells. Using this information, calculate the number of wells per 1,000 people in each region and state which region has better access to water resources. Explain one reason why inequality in water resources might exist between the two regions. (4 marks)",
    "hint": "Use wells per 1,000 people, not total wells, to compare access.",
    "working": [
      "Coastal Region: (24 ÷ 120000) × 1000 = 0.2 wells per 1,000 people",
      "Inland Region: (12 ÷ 150000) × 1000 = 0.08 wells per 1,000 people",
      "Comparison: 0.2 > 0.08, so the Coastal Region has better access to water resources"
    ],
    "answer": "Coastal: 24 ÷ 120,000 × 1000 = 0.20 wells per 1,000 people. Inland: 12 ÷ 150,000 × 1000 = 0.08. Coastal has more wells relative to population. Differences in investment or groundwater availability could explain this, but the figures do not establish the cause. Well capacity, quality, reliability and travel distance are also needed to compare actual access to safe water.",
    "notation": false
  },
  "y9-geography-weather-hazards/exam-5-AQA-core": {
    "question": "In a hypothetical severe flood affecting two contrasting countries, Bangladesh (Country A) and the United Kingdom (Country B), read the following scenario and compare the responses: In Country A, 1.8 million people are evacuated within 48 hours, 550 flood shelters are opened, and rescue operations are supported by 25,000 NGO volunteers using 120 boats and 40 helicopters, with local authorities coordinating the effort. In Country B, 30,000 households are evacuated within 24 hours, 100 flood refuges are opened, and rescue is carried out by 2,000 professional emergency responders using 60 boats and 15 helicopters, guided by the national flood warning system. Both contexts involve emergency services, local authorities and communities, but with different approaches: Bangladesh relies heavily on NGO volunteers and community networks; the UK relies on formal professional responders and a national warning system. Compare the responses in these two countries in terms of preparedness, evacuation, shelter, and relief, and assess whether these data establish which response was more effective at reducing immediate risk to people, using the information provided.",
    "marks": 6,
    "markScheme": [
      "Preparedness differences: Bangladesh relies on NGO volunteers and community networks; the UK relies on a national warning system and professional responders.",
      "Evacuation differences: Bangladesh evacuated 1.8 million people in 48 hours; UK evacuated 30,000 households in 24 hours.",
      "Shelter differences: Bangladesh opened 550 flood shelters; UK opened 100 flood refuges.",
      "Rescue resources and personnel: Bangladesh used 120 boats and 40 helicopters with 25,000 NGO volunteers; UK used 60 boats and 15 helicopters with 2,000 professional responders.",
      "Coordination and systems: Bangladesh relies on NGO-led networks coordinated with local authorities; UK operates under a national warning system with formal professional response.",
      "Explain that people and households are different units and that population at risk, shelter capacities and outcomes are missing; do not infer an overall effectiveness ranking from elapsed time alone."
    ],
    "answer": "In this hypothetical scenario, Bangladesh mobilises 25,000 NGO volunteers, 120 boats and 40 helicopters, while the UK uses 2,000 professional responders, 60 boats and 15 helicopters. Bangladesh evacuates 1.8 million people within 48 hours; the UK evacuates 30,000 households within 24 hours. The UK time window is shorter, but household size and the total populations at risk are unknown, so neither evacuation rate per person nor proportion protected can be compared fairly. Bangladesh opens 550 shelters and the UK 100 refuges; numbers of buildings do not establish their capacities or adequacy. Both involve coordination, with community networks prominent in Bangladesh and a national warning system in the UK. These differences show contrasting approaches, but casualties, unmet needs, warning reach and comparable coverage data are needed to judge overall effectiveness.",
    "notation": false
  },
  "y9-geography-weather-hazards/exam-7-AQA-core": {
    "question": "These are fictional teaching scenarios, not reports of named real disasters. Compare the impacts and responses to two contrasting weather hazards described below: a tropical cyclone in the Caribbean region called Hurricane Aria, with sustained winds of 210 km/h and 320 mm of rain in 24 hours, causing 14,000 people to be evacuated and around $2.5 billion of damage; and a heatwave in southern Europe lasting 9 days in July with maximum daytime temperatures up to 39°C, which led to 250 heat-related deaths and water restrictions affecting 7 million people. In your answer, compare the effects on people, infrastructure and economy, and identify the responses stated and explain additional responses governments and communities could use.",
    "marks": 6,
    "markScheme": [
      "Evacuations: recognise that Hurricane Aria forced large-scale evacuations (14,000 people) to keep people safe.",
      "Public health: identify heat-related deaths (250) and the strain from water restrictions affecting 7 million people during the heatwave.",
      "Economic impact: note the hurricane caused a clearly stated economic cost ($2.5 billion) from damage to homes and infrastructure.",
      "Vulnerability and impacts: compare how the two hazards affect different groups (health risk in heatwave vs immediate life/property risk in the cyclone).",
      "Time and duration: explain that the hurricane is rapid-onset and short-term, while the heatwave lasts 9 days and tests planning over a longer period.",
      "Responses: describe different government/community actions (evacuation orders, shelters and emergency services for the hurricane vs water restrictions and public health guidance for the heatwave)."
    ],
    "answer": "The fictional cyclone has winds of 210 km/h, 320 mm of rain in 24 hours, 14,000 evacuees and $2.5 billion damage. Evacuation is a stated response; warnings, shelters and emergency supplies would be plausible additional responses, but are not documented in the scenario. The damage figure indicates a substantial economic impact, although its division between homes and infrastructure is not given.\n\nThe fictional heatwave lasts nine days, reaches 39°C and causes 250 heat-related deaths. Water restrictions affect seven million people and are the stated response. Health advice, access to cool spaces and checks on vulnerable neighbours could also help. Heatwave infrastructure damage and economic costs are not quantified. Both threaten health and livelihoods, but these different measures do not support a single ranking of overall impact or prove that all cyclone effects are short-lived.",
    "notation": false
  },
  "y9-history-first-world-war-and-peace/exam-2-AQA-core": {
    "question": "Evaluate the extent to which the Treaty of Versailles (1919) achieved its aims for the Allies after the First World War. The Allies aimed to punish Germany, weaken its military power to prevent another war, redraw borders to create a new balance of power in Europe, and establish a League of Nations to maintain peace. Using examples from the treaty such as reparations, military restrictions, territorial changes and the creation of the League of Nations, assess how far these aims were met. To what extent did the treaty deliver lasting peace?",
    "marks": 6,
    "markScheme": [
      "Identifies the main aims of the peace settlement: punishment of Germany, military restrictions, territorial changes, and the League of Nations.",
      "Explains how reparations and economic penalties weakened Germany and caused resentment.",
      "Describes territorial losses and border changes and links them to instability or grievance.",
      "Describes military restrictions and notes their impact on German power and morale.",
      "Discusses the League of Nations and its limited power to enforce peace, including issues such as initial German exclusion and later participation.",
      "Produces a balanced judgement about lasting peace, arguing that the treaty achieved some short-term peace but failed to secure lasting peace."
    ],
    "answer": "The Treaty of Versailles did not fully achieve its aims for lasting peace. It did meet some short-term goals by ending active hostilities and setting up a framework intended to prevent future war, but it also created lasting problems. First, the treaty punished Germany in several ways. It imposed reparations, which damaged the German economy and led to resentment among many Germans. The financial burden contributed to hardship and instability in the 1920s, which helped fuel political discontent and nationalist feeling that undermined trust in the peace settlement. Second, the treaty restricted Germany’s military power. The army was limited to about 100,000 soldiers, conscription was ended, and heavy weapons and air power were banned. While this reduced Germany’s ability to wage war in the short term, many Germans felt humiliated by these limits, and the strict terms were a constant source of grievance that fed resentment toward the Allies. Third, significant territorial changes also caused discontent. Germany lost territory such as Alsace-Lorraine to France, and areas that created new borders, like the Polish Corridor, separated parts of Germany from its proper heartland. The Saar Basin was placed under international control for 15 years. These changes created a sense of injustice among many Germans and helped fuel nationalist opposition to the peace. Fourth, a key part of the aims was the creation of a League of Nations to prevent another world war. The League offered a framework for collective security and dispute resolution, but it had limited power to enforce its decisions. Importantly, the United States did not join, weakening its authority, and Germany was not initially allowed to join. This reduced the League’s effectiveness in stopping aggression and maintaining peace. In conclusion, while the Treaty of Versailles achieved some immediate aims—ending the war and creating a mechanism (the League) intended to preserve peace—it failed to deliver lasting peace. The combination of punitive reparations, humiliating and permanent restrictions on German power, and unresolved grievances over borders and national pride helped create conditions for further tensions in the 1930s, contributing to the rise of extremist movements and renewed conflict.",
    "notation": false
  },
  "y9-history-post-war-britain-and-decolonisation/practice-9-Edexcel-core": {
    "question": "Explain why Britain began to decolonise after 1945 and how this process affected its empire. In your answer, use the examples of India (1947) and Ghana (1957) as colonies that gained independence.",
    "hint": "Think about Britain's post-war economic problems and nationalist movements in colonies.",
    "working": [
      "Britain’s post-war economic weakness made imperial commitments harder to sustain.",
      "Nationalist movements pressed for self-government, and international conditions increasingly challenged colonial rule.",
      "Transfers of power involved negotiation, political struggle and, in some territories, violent conflict; there was no single peaceful pattern.",
      "British India was partitioned into independent India and Pakistan in 1947 amid mass displacement and violence. The Gold Coast became independent Ghana in 1957."
    ],
    "answer": "Economic pressure on Britain, nationalist movements and changing international conditions contributed to decolonisation. British India became independent India and Pakistan in 1947 through partition, accompanied by extensive violence and displacement. The Gold Coast became Ghana in 1957. Negotiated transfers were important, but conflict also shaped decolonisation, so it should not be described as uniformly peaceful.",
    "notation": false
  },
  "y9-history-war-and-the-holocaust/practice-5-AQA-core": {
    "question": "In autumn 1943, rescuers in Denmark helped more than 7,000 Jews reach safety in neutral Sweden by boat. About 500 Jews in Denmark were nevertheless seized and deported to Theresienstadt. Using this account, assess the achievement and limits of the rescue. Consider the roles of those escaping, their helpers and Sweden’s willingness to receive refugees. Source: United States Holocaust Memorial Museum, “Rescue of Danish Jews, fall 1943”.",
    "hint": "Saving lives was a major achievement, but consider who remained in danger and the conditions that made escape possible.",
    "working": [
      "Thousands of people escaped deportation and reached safety: a major humanitarian achievement.",
      "Those fleeing, local helpers and boat crews acted under risk, while Sweden provided a destination willing to receive refugees.",
      "The rescue did not protect everyone: approximately 500 people were deported.",
      "Denmark’s circumstances and access to Sweden mattered; this outcome cannot be assumed possible everywhere under Nazi occupation."
    ],
    "answer": "The rescue saved thousands of lives through the actions of Jewish refugees, helpers and boat crews, supported by Sweden’s acceptance of refugees. Its limits include the people who were still deported and the particular conditions needed for escape. Its significance should be judged through lives protected and agency under persecution, rather than whether it defeated the Nazi regime.",
    "notation": false
  },
  "y9-maths-equations/practice-8-Edexcel-core": {
    "question": "Question 9: A school charity fundraiser sells mugs. Each mug costs £0.60 to make, and there is a fixed cost of £12 for setup and stall. Each mug is sold for £3. Let n be the number of mugs sold. (a) Write down an expression for the total cost C(n) in terms of n. (b) Write down an expression for the total revenue R(n) in terms of n. (c) By forming and solving R(n) = C(n), find the break-even number of mugs. (d) If exactly 5 mugs are sold, what is the profit or loss?",
    "hint": "Think about when cost and revenue are equal.",
    "working": [
      "$C(n) = 0.60n + 12$",
      "$R(n) = 3n$",
      "$3n = 0.60n + 12$",
      "$3n - 0.60n = 12$",
      "$2.40n = 12$",
      "$n = \\frac{12}{2.40} = 5$"
    ],
    "answer": "Cost: C(n) = 0.60n + 12. Revenue: R(n) = 3n. Break-even: 3n = 0.60n + 12, so 2.40n = 12 and n = 5 mugs. At five mugs, both cost and revenue are £15, giving £0 profit or loss.",
    "notation": true
  },
  "y9-maths-probability/practice-5-AQA-core": {
    "question": "Question 6: In an experiment, two fair six-sided dice are rolled together 40 times. The sum is noted each time. The theoretical probability of obtaining a sum of 7 is 6/36 = 1/6. In the 40 trials, the sum 7 occurred 6 times. (a) Calculate the experimental probability of getting a sum of 7 in this experiment. (b) Compare the experimental probability with the theoretical probability. (c) Give one reason why the experimental result might differ from the theoretical probability.",
    "hint": "Express both probabilities with a common form before comparing.",
    "working": [
      "Step 1: Theoretical probability of sum 7 with two fair dice is $P_{theo} = \\frac{6}{36} = \\frac{1}{6}$.",
      "Step 2: Experimental probability from data is $P_{exp} = \\frac{6}{40} = \\frac{3}{20} = 0.15$.",
      "Step 3: Difference is $|P_{theo} - P_{exp}| = \\left| \\frac{1}{6} - \\frac{3}{20} \\right| = \\frac{1}{60} \\approx 0.0167$.",
      "Step 4: Conclusion: The experimental result is close to the theoretical probability, with a difference of about $0.0167$."
    ],
    "answer": "Experimental probability: 6/40 = 0.15. Theoretical probability: 1/6 ≈ 0.167. The experimental result is slightly lower. Random variation in a finite sample can explain the difference; larger samples tend to be closer to the theoretical value but are not guaranteed to match it exactly.",
    "notation": true
  },
  "y9-maths-pythagoras/exam-4-Edexcel-core": {
    "question": "Question 5: In the right-angled triangle ABC, angle C = $90°$, and sides $a = 3$ cm, $b = 4$ cm and $c = 5$ cm. Identify which side is the hypotenuse, which side is opposite angle A, and which side is adjacent to angle A. Here a = BC, b = AC and c = AB.",
    "marks": 3,
    "markScheme": [
      "Hypotenuse is c (AB), opposite the right angle.",
      "Opposite angle A is a (BC).",
      "Adjacent to angle A, excluding the hypotenuse, is b (AC)."
    ],
    "answer": "Hypotenuse: $c$ (length $5$ cm). Opposite angle A: $a$ (length $3$ cm). Adjacent to angle A: $b$ (length $4$ cm).",
    "notation": true
  },
  "y9-maths-pythagoras/practice-8-AQA-core": {
    "question": "Question 9 (Select an appropriate method): A ladder of length $175$ cm leans against a vertical wall. The distance from the base of the ladder to the wall is $60$ cm. How high up the wall does the top of the ladder reach? Decide which method is appropriate (Pythagoras' theorem or trigonometry) and use it to obtain the answer, showing your calculation. Give the height to one decimal place.",
    "hint": "Use Pythagoras' theorem to relate the height, the base and the ladder length.",
    "working": [
      "Step 1: Identify a right-angled triangle with hypotenuse $175$ cm and base $60$ cm, so $h^{2} = 175^{2} - 60^{2}$.",
      "Step 2: Compute $175^{2} = 30625$.",
      "Step 3: Compute $60^{2} = 3600$.",
      "Step 4: Subtract: $h^{2} = 30625 - 3600 = 27025$.",
      "Step 5: $h = \\sqrt{27025}$.",
      "Step 6: $h \\approx 164.4\\ \\text{cm}$ (to 1 d.p.)"
    ],
    "answer": "$164.4$ cm (to one decimal place).",
    "notation": true
  },
  "y9-maths-quadratics/exam-3-AQA-core": {
    "question": "A rectangle has area $50$ cm$^2$. Its length is $5$ cm longer than its width. Find both dimensions by forming and factorising a quadratic equation. Show your working.",
    "marks": 4,
    "markScheme": [
      "Forms $w(w+5)=50$.",
      "Rearranges to $w^2+5w-50=0$.",
      "Factorises to $(w+10)(w-5)=0$, with roots −10 and 5.",
      "Rejects the negative width and gives width 5 cm and length 10 cm."
    ],
    "answer": "Let width be $w$ cm and length be $w+5$ cm. Then $w(w+5)=50$, so $w^2+5w-50=0$. Factorising gives $(w+10)(w-5)=0$. Thus $w=-10$ or $w=5$. Only the positive value is a possible width: width 5 cm and length 10 cm. Check: $5 \\times 10=50$ cm$^2$.",
    "notation": true
  },
  "y9-maths-statistics/exam-0-AQA-core": {
    "question": "A Year 9 class is investigating how many pupils use a phone during break times at the school. They can choose one of three data‑collection approaches: A) Stand in the school atrium during the 20‑minute break and record whether each pupil who passes has used a phone during break; stop after you have interviewed 120 pupils. B) Number every pupil on the school roll, use a random-number generator to select 30 different pupils, and ask each the same question about phone use during breaks. C) In the library during three different breaks (one in the morning, one at lunch and one in the afternoon), count how many pupils have a phone out at the moment you look. Which approach would give the most reliable estimate of the proportion of pupils who use a phone during break times? Explain your choice. For each of the other two approaches, state one reason why it might be less reliable.",
    "marks": 4,
    "markScheme": [
      "Identify that Approach B is the most appropriate response.",
      "Explain that B uses random selection, which helps the sample better represent all pupils and reduces bias.",
      "Explain why Approach A is less reliable: it samples only pupils passing through the atrium in a short time, which may not reflect all pupils.",
      "Explain why Approach C is less reliable: it only counts library users at three moments and may miss many pupils who are not in the library or not using phones at those times."
    ],
    "answer": "B uses a random sample from the whole school roll, giving each pupil a chance of selection and reducing location-based bias. A only reaches pupils passing the atrium; C only observes library users at selected moments and measures current use rather than any use during breaks. B can still be affected by its sample size, non-response and inaccurate answers.",
    "notation": true
  },
  "y9-maths-statistics/practice-3-Edexcel-core": {
    "question": "Question 4 - A secondary school has $720$ pupils. To find out the most popular lunch option, a survey is planned with a sample of $60$ pupils. Three possible ways to select the sample are described below: A) Use a list of all pupils in the school. Starting at a random point on the list, every $12$th pupil on the list is chosen until $60$ pupils are selected. B) On a single day, stand in the food queue and take the first $60$ pupils who arrive. C) From the school register, randomly pick $60$ pupils to invite to complete the survey. Which method would be most likely to give a fair sample of the pupil opinions? Give a brief reason for your choice.",
    "hint": "Think about which method is least biased by the order in which pupils appear or queue.",
    "working": [
      "B risks bias because it samples only early arrivals in one queue.",
      "C is a reasonable choice if all pupils are on the register and selection is genuinely random.",
      "A can also be suitable if the list has no relevant repeating pattern; a random start should be chosen among the first 12 entries.",
      "Any method can still be affected by non-response."
    ],
    "answer": "C is a reasonable choice because random selection from the complete register gives each pupil an equal chance. A can also give a useful systematic sample if its random start and list order are suitable; C is not guaranteed to be representative in every realised sample. B is more vulnerable to bias from who joins that queue early. Check non-response whichever method is used.",
    "notation": true
  },
  "y9-science-bioenergetics/practice-3-AQA-core": {
    "question": "Question 4 (Write word equations) - Write the word equations for photosynthesis and aerobic respiration.",
    "hint": "Think about what plants use to make food and what cells release to supply energy.",
    "working": [
      "Photosynthesis uses carbon dioxide and water to produce glucose and oxygen.",
      "Light supplies energy, absorbed by chlorophyll; it is a condition, not a chemical reactant.",
      "Aerobic respiration uses glucose and oxygen to produce carbon dioxide and water.",
      "Respiration releases energy for cellular processes; energy is not a material product."
    ],
    "answer": "Photosynthesis: carbon dioxide + water → glucose + oxygen (using light energy absorbed by chlorophyll).\n\nAerobic respiration: glucose + oxygen → carbon dioxide + water (energy is released).",
    "notation": false
  },
  "y9-science-electricity/practice-0-Edexcel-core": {
    "question": "You have a 9 V battery, a resistor of 470 Ω labelled R1 and another resistor of 330 Ω labelled R2. Describe, in words, how you would connect these components in series with a switch so that current flows from the positive terminal of the battery, through R1 then R2, and back to the negative terminal. Then calculate: (a) the total resistance of the circuit, (b) the current in the circuit when the switch is closed, and (c) the potential difference across R1.",
    "hint": "Remember that resistors in series add together, and the same current flows through both components.",
    "working": [
      "R_total = R1 + R2 = 470 Ω + 330 Ω = 800 Ω",
      "I = V / R_total = 9 V / 800 Ω = 0.01125 A",
      "V_R1 = I × R1 = 0.01125 A × 470 Ω = 5.2875 V"
    ],
    "answer": "Connect the battery positive terminal to the switch, then R1, then R2, and finally back to the negative terminal, with no branches. R_total = 800 Ω; I = 11.25 mA; V_R1 ≈ 5.29 V",
    "notation": false
  },
  "y9-science-electricity/practice-4-Edexcel-core": {
    "question": "A 9.0 V battery is connected to a fixed resistor of 3.0 Ω in a simple circuit. Using Ohm's law, calculate the current in the circuit. If the resistor is then changed to 6.0 Ω while the battery remains 9.0 V, explain how the current changes and calculate the new current.",
    "hint": "Increasing resistance reduces current; when resistance doubles, current halves.",
    "working": [
      "I1 = V / R with V = 9.0 V and R = 3.0 Ω, I1 = 9.0 / 3.0 = 3.0 A",
      "I2 = V / R2 with V = 9.0 V and R2 = 6.0 Ω, I2 = 9.0 / 6.0 = 1.5 A",
      "The current in the second circuit is lower because resistance doubled, so I2 is half of I1: 1.5 A is half of 3.0 A."
    ],
    "answer": "The original current I1 is 3.0 A. After resistance doubles, I2 is 1.5 A. With the same voltage, doubling resistance halves current.",
    "notation": false
  },
  "y9-science-pressure/practice-0-AQA-core": {
    "question": "A horizontal seesaw has a pivot at its centre. A weight of 180 N is placed 25 cm to the left of the pivot, and a weight of 120 N is placed 40 cm to the right of the pivot. Calculate the moment produced by each weight about the pivot. Determine which way the seesaw will tilt and give the net moment about the pivot in N cm.",
    "hint": "Moment is calculated by multiplying the force by its perpendicular distance from the pivot.",
    "working": [
      "The left downward force gives an anticlockwise moment: 180 × 25 = 4500 N cm.",
      "The right downward force gives a clockwise moment: 120 × 40 = 4800 N cm.",
      "The net moment is 4800 − 4500 = 300 N cm clockwise."
    ],
    "answer": "The moments are 4500 N cm anticlockwise and 4800 N cm clockwise. Net moment: 300 N cm clockwise, so the right side moves down.",
    "notation": false
  },
  "y9-science-pressure/practice-3-Edexcel-core": {
    "question": "4 marks. A lever 65 cm long rests on a pivot 25 cm from the left end. A downward force of 8.0 N acts at the left end. A downward force of 3.0 N acts at a point 40 cm to the right of the pivot. Calculate the moment of each force about the pivot and state the net turning effect (clockwise or anticlockwise).",
    "hint": "Compare which side of the pivot each force is on to decide the direction of each moment.",
    "working": [
      "Convert distances: 25 cm = 0.25 m and 40 cm = 0.40 m.",
      "The left downward force gives 8.0 × 0.25 = 2.0 N m anticlockwise.",
      "The right downward force gives 3.0 × 0.40 = 1.2 N m clockwise.",
      "The net is 2.0 − 1.2 = 0.8 N m anticlockwise."
    ],
    "answer": "Left force: 2.0 N m anticlockwise. Right force: 1.2 N m clockwise. Net moment: 0.8 N m anticlockwise; the left end moves down.",
    "notation": false
  }
};
