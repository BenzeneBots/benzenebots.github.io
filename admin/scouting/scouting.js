const getResponsesByEvent = async () => {
    let json = await fetch(API_ROOT + '/survey/get_by_event_key/'+district_key, {
        method: 'GET',
        headers: {
            id: auth.id,
            password: auth.password
        }
    })
        .then(res => res.json());

    if (json && json.length !== 0) {
        let out = "";

        Object.keys(json).forEach(team_num => {
            let team = json[team_num]
            let team_element = `<table class="centered" style="margin-bottom: 10px">
                    <tr class="key">
                        <h1 colspan="16" class="on" style="text-align: center;" onclick="change_status(this)">${team_num}</h1>
                        <tbody id="${team_num}-out">
                            <th>Scouter</th>
                            <th>Auton</th>
                            <th>Climb</th>
                            <th>Climb Bar</th>
                            <th>Drive Train</th>
                            <th>Driving Rating</th>
                            <th>Robot Type</th>
                            <th>Shooting Hub</th>
                            <th>Shots</th>
                            
                           </tbody>
                        </tr>
                    </table>
                    <hr>`
            document.getElementById("out").innerHTML += team_element;
            team.forEach((data) => {
                out = `<tr>
                        <td>${data.scouter_name}</td>
                        <td>${data.auton}</td>
                        <td>${data.climb}</td>
                        <td>${data.climb_bar}</td>
                        <td>${data.drive_train}</td>
                        <td>${data.driving_rating}</td>
                        <td>${data.robot_type}</td>
                        <td>${data.shooting_hub}</td>
                        <td>${data.shots}</td>
                       </tr>`
                document.getElementById(team_num+"-out").innerHTML += out;
            })
        })
    } else {
        M.toast({
            html: json.error
        });
    }

}

function change_status(ele) {
    console.log(ele.style)
}