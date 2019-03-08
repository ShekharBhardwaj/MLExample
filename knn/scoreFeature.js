const outputs = [];



function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
  const testSetSize = 100;
  const k = 10;
 
  // let numberCorrect = 0;
  // for (let i = 0; i < testData.length; i++) {
  //   let bucket = knn(trainigData, testData[i][0]);
  //   if(bucket === testData[i][3]){
  //     numberCorrect++;
  //   }
  // }
  // console.log(`Accuracy: ${numberCorrect/testSetSize}`);
  _.range(0, 3).forEach(feature => { 
    let data =  _.map(outputs, row => [row[feature], _.last(row)]);
    let [testData, trainigData] = splitDataset(minMax(data, 1), testSetSize);
    let accuracy = _.chain(testData)
    .filter(testPoint => {
      return knn(trainigData, _.initial(testPoint), k) === _.last(testPoint);
    })
    .size()
    .divide(testSetSize)
    .value();
  
    console.log(`For feture of: ${feature} -> Accuracy: ${accuracy}`);}
    )
}

const distance = (pointA, pointB) => {
  return _.chain(pointA)
            .zip(pointB)
            .map(([a, b]) => {
              return (a - b) ** 2;
            })
            .sum()
            .value() ** 0.5;
}

const knn = (data, point, k) => {
  return _.chain(data)
    .map(row => [distance(_.initial(row), point), _.last(row)])
    .sortBy(row => row[0])
    .slice(0, k)
    .countBy(row => row[1])
    .toPairs()
    .sortBy(row => row[1])
    .last()
    .first()
    .parseInt()
    .value();
}

const splitDataset = (data, testCount) => {
  let shuffled = _.shuffle(data);
  let testData = _.slice(shuffled, 0, testCount);
  let trainigData = _.slice(shuffled, testCount);
  return [testData, trainigData];
}

const minMax = (data, featureCount) => {
  let clonedData = _.cloneDeep(data);
  for(let i=0; i< featureCount; i++){
    const column = clonedData.map(row => row[i]);
    const min = _.min(column);
    const max = _.max(column);
    for(let j = 0; j < clonedData.length; j++){
      clonedData[j][i] = (clonedData[j][i] - min)/(max-min);
    }
  }

  return clonedData;
}