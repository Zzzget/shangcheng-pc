/**
 * 用BITWISE方法找到一个集合的幂集。
 *
 * @param {*[]} originalSet
 * @return {*[][]}
 */
export default function bwPowerSet(originalSet) {
  const subSets = []

  // 我们将有2^n种可能的组合(其中n是原始集合的长度)。
  // 这是因为对于原始集合的每个元素，我们将决定是否包含它(每个集合元素有2个选项)。
  const numberOfCombinations = 2 ** originalSet.length

  // 在0到2^n范围内的二进制表示中的每个数字都正是我们所需要的:
  // 它通过它的位(0或1)显示是否包含集合中的相关元素。
  // 例如，对于集合{1,2,3}，二进制数0b010意味着我们需要
  // 在当前集合中只包含“2”。
  for (
    let combinationIndex = 0;
    combinationIndex < numberOfCombinations;
    combinationIndex += 1
  ) {
    const subSet = []

    for (
      let setElementIndex = 0;
      setElementIndex < originalSet.length;
      setElementIndex += 1
    ) {
      // 决定是否需要将当前元素包含到子集中。
      if (combinationIndex & (1 << setElementIndex)) {
        subSet.push(originalSet[setElementIndex])
      }
    }

    // 将当前子集添加到所有子集的列表中。
    subSets.push(subSet)
  }

  return subSets
}
