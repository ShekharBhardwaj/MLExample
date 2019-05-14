const outputs = [];



function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
    outputs.push([dropPosition, bounciness, size, bucketLabel]);
    //console.log(outputs);
}

function runAnalysis() {
    let testCountSize = 10;
    let [test, train] = splitData(outputs, testCountSize);

    // let predictionMatches = 0;
    // for(let i = 0; i < test.length; i++){
    //     const bucket = knn(train, test[i][0]);
    //     if(bucket === test[i][3]){
    //         predictionMatches ++;
    //     }
    // }
    // console.log(`Accuracy: ${predictionMatches/testCountSize}`);
    _.range(0, 15).forEach(k => {
        const accuracy = _.chain(test)
            .filter(testPoint => knn(train, _.initial(testPoint), k) === testPoint[3])
            .size()
            .divide(testCountSize)
            .value();
        console.log(`for K: ${k} Accuracy: ${accuracy}`);
    });

}

const distance = (pointA, pointB) => {
    return _.chain(pointA)
        .zip(pointB)
        .map(([a, b]) => (a - b) ** 2)
        .sum().value() ** 0.5;
}

const knn = (data, point, k) => {
    return _.chain(data)
        .map(row => [distance(_.initial(data), point), _.last(data)])
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

const splitData = (data, testCount) => {
    let shuffled = _.shuffle(data);
    let test = _.slice(shuffled, 0, testCount);
    let train = _.slice(shuffled, testCount);
    return [test, train];
}