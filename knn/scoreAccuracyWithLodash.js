const outputs = [];

const k = 3;

const onScoreUpdate = (dropPosition, bounciness, size, bucketLabel) => {
    outputs.push([dropPosition, bounciness, size, bucketLabel]);
    // console.log(outputs);
}

const distance = (pointA, pointB) => {
    return Math.abs(pointA - pointB);
}

const runAnalysis = () => {
    console.log('Analysing...');
    let testDataSize = 10;
    let [testSet, trainingSet] = splitData(outputs, testDataSize);
    let accuracy = _.chain(testSet)
        .filter(testPoint => knn(trainingSet, testPoint[0]) === testPoint[3])
        .size()
        .divide(testDataSize)
        .value();
    console.log(`Accracy ${accuracy * 100}`);
}

const knn = (data, point) => {
    return _.chain(data)
        .map(row => [distance(row[0], point), row[3]])
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

const splitData = (data, testSetPointer) => {
    let shuffledData = _.shuffle(data);
    let testSet = _.slice(shuffledData, 0, testSetPointer);
    let trainingSet = _.slice(shuffledData, testSetPointer);
    return [testSet, trainingSet];
}