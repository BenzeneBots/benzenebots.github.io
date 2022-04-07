const getResponsesByTeamNumber = async () => {
    let json = await fetch(API_ROOT + '/survey/get/4384', {
        method: 'GET',
        headers: {
            id: auth.id,
            password: auth.password
        }
    })
        .then(res => res.json());

    if (json) {
        let res = json.response
        let out = `<tr>
                    <td>${json.team_number}</td>                        
                    <td>${res.scouter_name}</td>                        
                    <td>${res.auton}</td>                       
                    <td>${res.climb}</td>                       
                    <td>${res.climb_bar}</td>                       
                    <td>${res.drive_train}</td>                       
                    <td>${res.driving_rating}</td>                       
                    <td>${res.robot_type}</td>                       
                    <td>${res.shooting_hub}</td>                       
                    <td>${res.shots}</td>                                            
                </tr>`
        document.getElementById("out").innerHTML = out;
    } else {
        M.toast({
            html: json.error
        });
    }

}