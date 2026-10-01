// Authored, outcome-specific teaching. Do not substitute another outcome's
// lesson when an entry is missing; the selector explicitly labels the overview.
import { generatedSubtopicLessons } from './generatedSubtopicLessons.js';
export const subtopicLessons = {
  ...generatedSubtopicLessons,
  'y9-science-genetics': [
    {
      title: 'Describe genes and chromosomes',
      explanation: 'DNA is the molecule that carries inherited information. In the nucleus of a typical plant or animal cell, long DNA molecules are packaged into chromosomes. Each chromosome contains many genes. A gene is a section of DNA carrying instructions used by a cell; many genes contain instructions for making proteins. Different versions of a gene are called alleles. Most human body cells with a nucleus normally contain 46 chromosomes, arranged in 23 pairs, with one member of each pair inherited from each parent. Human gametes, the egg and sperm cells, normally contain 23 single chromosomes. Fertilisation brings these two sets together. Do not confuse a gene, a chromosome and the nucleus: genes are sections of DNA on chromosomes, while the nucleus contains the chromosomes.',
      keyIdeas: ['A chromosome is a long DNA molecule packaged with proteins; it carries many genes.', 'An allele is a version of a gene, not a separate type of cell.', 'Most nucleated human body cells normally have 23 chromosome pairs; human gametes normally have 23 single chromosomes.'],
      formulae: [],
    },
    {
      title: 'Explain inherited variation',
      explanation: 'Variation means differences between individuals of the same species. Inherited variation arises because individuals can carry different alleles. Mutations change DNA and can produce new alleles; they do not arise because an organism needs a particular feature. During sexual reproduction, the formation of gametes and their fusion at fertilisation bring alleles together in different combinations. This helps explain why siblings usually resemble their parents but are not identical to one another. Characteristics can also be affected by the environment. For instance, height is influenced by many genes as well as factors such as nutrition. Distinguish the genotype, an organism\'s genetic makeup, from the phenotype, its observable characteristics resulting from genes and their interaction with the environment.',
      keyIdeas: ['Sexual reproduction combines inherited alleles in different ways.', 'Mutations can produce new alleles; most are not beneficial adaptations.', 'Inherited and environmental influences can both contribute to a characteristic.'],
      formulae: [],
    },
    {
      title: 'Outline natural selection',
      explanation: 'Natural selection begins with variation within a population. Some differences are inherited. In a particular environment, an inherited characteristic may help an individual survive and reproduce more successfully than others. Those individuals are more likely to pass the alleles associated with that characteristic to their offspring. Over many generations, the characteristic can become more common in the population. The advantage depends on the environment: a feature helpful in one setting may be unhelpful in another. The key sequence is inherited variation, a selection pressure, differences in reproductive success, and inheritance by offspring. Individuals do not deliberately develop useful mutations, and surviving alone is not enough: the inherited difference must affect the contribution to later generations.',
      keyIdeas: ['Selection acts on existing variation; mutations are not produced to meet an organism\'s needs.', 'Explain why a characteristic affects survival or reproduction in the stated environment.', 'Populations change over generations; an individual does not evolve during its lifetime.'],
      formulae: [],
    },
    {
      title: 'Explain the work of Mendel',
      explanation: 'Gregor Mendel studied inheritance by crossing pea plants with contrasting characteristics and counting the characteristics of their offspring. In some crosses, a characteristic absent from the first generation reappeared in the next. This suggested that inherited information was passed on in discrete units rather than permanently blended. Mendel proposed that offspring received a unit for a characteristic from each parent, and that one unit could mask the effect of another. These observations helped establish the ideas now described using genes, alleles, dominance and segregation. Mendel did not discover the structure of DNA. His large numbers of offspring and controlled crosses helped reveal patterns, but the simple dominant and recessive model does not explain every characteristic: many traits involve several genes and environmental influences.',
      keyIdeas: ['Controlled crosses and counting many offspring revealed inheritance patterns.', 'A recessive characteristic can be hidden in one generation and reappear in another.', 'Mendel\'s inherited units anticipated genes; his work did not identify DNA\'s molecular structure.'],
      formulae: [],
    },
    {
      title: 'Use Punnett squares to predict inheritance',
      explanation: 'A Punnett square lists possible allele combinations for offspring in a genetic cross. For a simple single-gene dominant and recessive model, use a capital letter for the dominant allele and the matching lower-case letter for the recessive allele. Write each parent\'s genotype, then identify the single allele each possible gamete can carry. Put one parent\'s gametes across the top of a grid and the other parent\'s down the side. Fill each cell by combining its row and column alleles. Count the possible genotypes, then use the dominance information to predict phenotypes. When the gametes are equally likely, each grid cell represents an equally likely combination. The results predict probabilities for each offspring, not a guaranteed pattern in a small family.',
      keyIdeas: ['Gametes carry one allele for the gene in a simple single-gene cross.', 'Genotype is the allele combination; phenotype is the expressed characteristic.', 'Dominant does not mean stronger, better or more common, and predicted ratios are not guaranteed family totals.'],
      formulae: [],
    },
    {
      title: 'Explain natural selection and speciation',
      explanation: 'Natural selection can change the inherited characteristics of a population without producing a new species. Speciation is the formation of new species. One route starts when a population becomes separated, for example by a geographical barrier, so that the groups no longer exchange alleles through interbreeding. Mutations introduce variation, and different selection pressures can favour different inherited characteristics in the two environments. Over many generations, genetic differences can accumulate. In sexually reproducing organisms, the groups may eventually become unable to interbreed successfully to produce fertile offspring, providing evidence that they are different species under the biological species definition. Separation does not guarantee speciation, and it need not happen quickly. Explain how reproductive isolation develops rather than simply stating that animals moved to a new place.',
      keyIdeas: ['Natural selection within a population and the formation of a new species are different outcomes.', 'Reduced gene flow allows separated populations to change independently.', 'For many sexually reproducing organisms, inability to produce fertile offspring is used to distinguish species; this definition does not apply neatly to every organism.'],
      formulae: [],
    },
  ],
  'y9-maths-powers': [
    {
      title: 'Apply index laws',
      explanation: 'A positive integer index counts repeated factors of the base. When multiplying powers of the same base, add their indices because you are combining the factors. When dividing, subtract the indices; the base must be non-zero. Raising a power to another power multiplies the indices. These rules do not apply to adding powers. A non-zero base raised to zero equals one, and a negative integer index means take the reciprocal.',
      keyIdeas: ['Check that the bases match before combining indices in a product or quotient.', 'Add indices for multiplication, subtract for division, and multiply for a power of a power.', 'Zero and negative indices require a non-zero base. Zero to the power zero is not assigned a value by these rules.'],
      formulae: ['$a^m \\times a^n = a^{m+n}$', '$a^m \\div a^n = a^{m-n}$, for $a \\ne 0$', '$(a^m)^n = a^{mn}$', '$a^0 = 1$ and $a^{-n} = \\frac{1}{a^n}$, for $a \\ne 0$'],
    },
    {
      title: 'Estimate roots',
      explanation: 'To estimate a positive square root, find the consecutive square numbers on either side of the number. Their positive roots give a lower and upper limit. Test decimal values by squaring them to narrow the interval. To round the root, compare with the midpoint between the possible rounded answers. A root estimate is approximate; keep the root sign when an exact value is required. For a cube root, use nearby cube numbers and test by cubing instead.',
      keyIdeas: ['The square-root symbol means the non-negative square root.', 'Use nearby squares or cubes as benchmarks, then refine by testing.', 'Check the requested accuracy. Do not present an estimate as an exact equality.'],
      formulae: [],
    },
    {
      title: 'Calculate with standard form',
      explanation: 'For multiplication in standard form, multiply the coefficients and add the powers of ten. For division, divide the coefficients and subtract the powers of ten. Adjust the result so the positive coefficient is at least one and less than ten. For addition or subtraction, first express both numbers using the same power of ten, then combine their coefficients. Do not add the indices when adding the numbers.',
      keyIdeas: ['Choose the rule for the operation actually given.', 'If the coefficient becomes ten times smaller, increase the exponent by one to keep the value unchanged.', 'Check the approximate size of the answer and write it in standard form.'],
      formulae: ['$(a \\times 10^m)(b \\times 10^n) = ab \\times 10^{m+n}$', '$\\frac{a \\times 10^m}{b \\times 10^n} = \\frac{a}{b} \\times 10^{m-n}$, for $b \\ne 0$', 'For a positive number: $A \\times 10^n$, where $1 \\le A < 10$ and $n$ is an integer.'],
    },
    {
      title: 'Use powers of ten to multiply and divide',
      explanation: 'Multiplying by a positive integer power of ten makes each digit worth ten times as much for each power. Dividing has the opposite effect. Use place value to move the digits relative to the decimal point, adding placeholder zeros where needed. A negative power of ten is a reciprocal, so multiplying by it is equivalent to dividing by the corresponding positive power. Check whether the operation should make the positive number larger or smaller.',
      keyIdeas: ['Multiplying by one hundred shifts digits two place-value columns to the left.', 'Dividing by one thousand shifts digits three place-value columns to the right.', 'Multiplying by a negative power of ten reduces a positive number; it does not make the number negative.'],
      formulae: ['$10^{-n} = \\frac{1}{10^n}$', '$x \\times 10^{-n} = x \\div 10^n$'],
    },
    {
      title: 'Convert between ordinary and standard form',
      explanation: 'To write a positive number in standard form, choose a coefficient from one up to, but not including, ten. Count the powers of ten needed to recover the original number. A large number uses a positive exponent; a number between zero and one uses a negative exponent. To convert back, multiply the coefficient by the stated power of ten. Conversion changes the way a number is written, not its value.',
      keyIdeas: ['There is exactly one non-zero digit before the decimal point in the coefficient.', 'A coefficient of ten is too large and must be adjusted.', 'Check the conversion by reversing it and comparing with the original number.'],
      formulae: [],
    },
    {
      title: 'Apply the priority of operations to powers and roots',
      explanation: 'Evaluate brackets first, including any calculations inside a root sign. Then evaluate powers and roots. Carry out multiplication and division from left to right, followed by addition and subtraction from left to right. Brackets decide what is raised to a power: a negative number in brackets is different from a minus sign placed before a power. Write the intermediate expression after each step so the order stays clear.',
      keyIdeas: ['A root sign groups everything written underneath it.', 'Multiplication and division have equal priority; work from left to right.', 'A square applies to the base in its brackets, while an unbracketed leading minus stays outside the square.'],
      formulae: [],
    },
  ],
};
