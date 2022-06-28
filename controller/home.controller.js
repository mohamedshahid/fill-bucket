const home = (req, res) => {
    res.send(`
		<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
		<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
		<div class="container">
			<h1 class="text-center mt-3 mb-3">Ignore negative and decimal values</h1>
			<div class="card">
				<div class="card-header">Sample Form</div>
				<div class="card-body">
					<form method="POST" action="/">
						<div class="row">
							<div class="col">
								<label>Bucket Volume</label>
								<input type="number" name="bucket[]" class="form-control" placeholder="A" required />
								<input type="number" name="bucket[]" class="form-control" placeholder="B" required />
								<input type="number" name="bucket[]" class="form-control" placeholder="C" required />
								<input type="number" name="bucket[]" class="form-control" placeholder="D" required />
								<input type="number" name="bucket[]" class="form-control" placeholder="E" required />
							</div>
							<div class="col">
								<label>Ball Volume</label>
								<input type="number" name="ballVolume[]" placeholder="Pink" class="form-control" required />
								<input type="number" name="ballVolume[]" placeholder="Red" class="form-control" required />
								<input type="number" name="ballVolume[]" placeholder="Blue" class="form-control" required />
								<input type="number" name="ballVolume[]" placeholder="Orange" class="form-control" required />
								<input type="number" name="ballVolume[]" placeholder="Green" class="form-control" required />
							</div>
							<div class="col">
							<label>Ball Count</label>
							<input type="number" name="ballCount[]" placeholder="Pink" class="form-control" required />
							<input type="number" name="ballCount[]" placeholder="Red" class="form-control" required />
							<input type="number" name="ballCount[]" placeholder="Blue" class="form-control" required />
							<input type="number" name="ballCount[]" placeholder="Orange" class="form-control" required />
							<input type="number" name="ballCount[]" placeholder="Green" class="form-control" required />
							</div>
						</div>

						<div class="row">
							<div class="col">
								<input type="submit" name="submit_button" class="btn btn-primary" value="Add" />
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	`);
};

const submitBucketForm = (req, res) => {
    const buckets = makeBuckets(req.body.bucket);
	let balls = makeBalls(req.body.ballVolume, req.body.ballCount)
	const filledBuckets = [];

	buckets.forEach(bucket => {
		let {balls: pendingBalls, bucket: filledBucket} = fillBucket(bucket, balls);
		balls = pendingBalls;
		filledBuckets.push(filledBucket);
	});
    
    res.send(`
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        <div class="container">
			<h1 class="text-center mt-3 mb-3">Results</h1>
			<div class="card">
				<div class="card-header">Output</div>
				<div class="card-body">
                    <div class="row">
                        <div class="col">
                            <ul class="list-group">
                                ${filledBuckets.map(bucket => `<li class="list-group-item">Bucket ${bucket.name}: Placed ${renderBalls(bucket.balls)}</li>`)}
                            </ul>
                        </div>
                    </div>
				</div>
			</div>
		</div>
    `);
}

const renderBalls = (balls) => {
    let ballStatement = '';
    
    if(balls.length < 1) {
        return '0 balls';
    }

    balls.forEach(ball => {
        ballStatement += ` ${ball.count} ${ball.color} balls`;
    });

    return ballStatement;
}

const makeBuckets = (buckets) => {
	return [
		{name: 'A', size: buckets[0], filled: 0, empty: buckets[0], balls: []},
		{name: 'B', size: buckets[1], filled: 0, empty: buckets[1], balls: []},
		{name: 'C', size: buckets[2], filled: 0, empty: buckets[2], balls: []},
		{name: 'D', size: buckets[3], filled: 0, empty: buckets[3], balls: []},
		{name: 'E', size: buckets[4], filled: 0, empty: buckets[4], balls: []},
	];
}

const makeBalls = (ballsVolume, ballsCount) => {
	return [
		{color: 'pink', size: ballsVolume[0], count: ballsCount[0]},
		{color: 'red', size: ballsVolume[1], count: ballsCount[1]},
		{color: 'blue', size: ballsVolume[2], count: ballsCount[2]},
		{color: 'orange', size: ballsVolume[3], count: ballsCount[3]},
		{color: 'green', size: ballsVolume[4], count: ballsCount[4]},
	];
}

function isFillable(empty, balls) {
    if (empty == 0) {
        return false;
    }

    const availableBalls = balls.filter(ball => ball.count > 0);

    if(availableBalls.length < 1) {
        return false;
    }

    const fillableBallAvailable = availableBalls.some(ball => ball.count <= empty);

    if(!fillableBallAvailable) {
        return false;
    }

    return true;
}

function bucketAddBall(bucket, ball) {
    isBallInserted = bucket.balls.some(bucketBall => bucketBall.color == ball.color);

    if (isBallInserted) {
        bucket.balls = bucket.balls.map(bucketBall => {
            if(bucketBall.color == ball.color) {
                bucketBall.count = bucketBall.count + 1;
            }

            return bucketBall;
        })
    } else {
        bucket.balls.push({...ball, count: 1});
    }

    return bucket;
}

function fillBucket(bucket, balls) {
    let empty = bucket.empty;
    
    while(isFillable(empty, balls)) {
        for (const ball of balls) {
            if(ball.count > 0 && parseInt(ball.size) <= empty) {
                bucket = bucketAddBall(bucket, ball);
                bucket.filled = parseInt(bucket.filled) + parseInt(ball.size);
                bucket.empty = parseInt(bucket.size) - parseInt(bucket.filled);
                ball.count = ball.count - 1;
                break;
            }
        }

        empty = bucket.empty;
    }

    /* console.log(bucket);
    console.log(balls); */

    return {balls, bucket};
}

module.exports = {
    home,
    submitBucketForm
}