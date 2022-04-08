const submit_form = () => {
    let Team_Number = document.getElementById("team_number");
    let Scouter_Name = document.getElementById("scouter_name");
    let AutonAnswer = document.getElementById("AutonAnswer");
    let ShotsAnswer = document.getElementById("ShotsAnswer");

    let DriveTrain = document.getElementsByName("driveTrain")
    let ShootingHub = document.getElementsByName("shootingHub")
    let DrivingRating = document.getElementsByName("driver-rating")
    let Robot_Type = document.getElementsByName("robot-type")
    let isClimb = document.getElementsByName("isClimb")
    let Climb_Bar = document.getElementsByName("climb_bar")

    let data = {}

    data["team_number"] = Team_Number.value
    data["scouter_name"] = Scouter_Name.value
    data["auton"] = AutonAnswer.value
    data["shots"] = ShotsAnswer.value

    DriveTrain.forEach(((value, key) => {
        if (value.checked) {
            data["drive_train"] = value.parentElement.childNodes[3].innerText
        }
    }))

    ShootingHub.forEach(((value, key) => {
        if (value.checked) {
            data["shooting_hub"] = value.parentElement.childNodes[3].innerText
        }
    }))

    DrivingRating.forEach(((value, key) => {
        if (value.checked) {
            data["driving_rating"] = value.parentElement.childNodes[3].innerText
        }
    }))

    Robot_Type.forEach(((value, key) => {
        if (value.checked) {
            data["robot_type"] = value.parentElement.childNodes[3].innerText
        }
    }))

    isClimb.forEach(((value, key) => {
        if (value.checked) {
            data["climb"] = value.parentElement.childNodes[3].innerText
        }
    }))

    Climb_Bar.forEach(((value, key) => {
        if (value.checked) {
            data["climb_bar"] = value.parentElement.childNodes[3].innerText
        }
    }))

    fetch(API_ROOT + '/survey/add', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            id: localStorage.id,
            password: localStorage.password
        },
        body: JSON.stringify({
            comp: district_key,
            data: data
        })
    })
}
