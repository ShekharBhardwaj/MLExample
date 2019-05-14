const outputs = [];
const predictionPoint = 401;
const k = 3;

const onScoreUpdate = (dropPosition, bounciness, size, bucketLabel) => {
    outputs.push([dropPosition, bounciness, size, bucketLabel]);
   // console.log(outputs);
}

const distance = (point) => {
    return Math.abs(predictionPoint - point);
}

const runAnalysis = () => {
    let bucket = _.chain(outputs)
        .map(row => [distance(row[0]), row[3]])
        .sortBy(row => row[0])
        .slice(0, k)
        .countBy(row => row[1])
        .toPairs()
        .sortBy(row => row[1])
        .last()
        .first()
        .parseInt()
        .value();
    console.log(`Ball probably will drop in bucket: ${bucket}`);
}