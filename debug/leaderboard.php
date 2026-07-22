<?php
include 'db.php';

$result = $conn->query("
    SELECT participants.name, participants.team_name, scores.total_score 
    FROM scores 
    JOIN participants ON scores.participant_id = participants.id
    ORDER BY scores.total_score DESC
");
?>

<!DOCTYPE html>
<html>
<head>
    <title>Leaderboard</title>
    <link rel="stylesheet" href="leaderboard.css">
</head>
<body>

<h1 class="title">LEADERBOARD</h1>

<div class="table-container">

<table>
    <tr>
        <th>Rank</th>
        <th>Name</th>
        <th>Team</th>
        <th>Score</th>
    </tr>

<?php 
$rank = 1;
while($row = $result->fetch_assoc()) {

    $class = "";
    if($rank == 1) $class = "gold";
    elseif($rank == 2) $class = "silver";
    elseif($rank == 3) $class = "bronze";
?>

<tr class="<?php echo $class; ?>">
    <td><?php echo $rank; ?></td>
    <td><?php echo $row['name']; ?></td>
    <td><?php echo $row['team_name']; ?></td>
    <td><?php echo $row['total_score']; ?></td>
</tr>

<?php 
$rank++;
} 
?>

</table>

</div>

</body>
<script>
setInterval(() => {
    location.reload();
}, 5000); // refresh every 5 seconds
</script>
</html>