const submit_form=()=>{let e=document.getElementById("team_number"),t=document.getElementById("scouter_name"),n=document.getElementById("AutonAnswer"),o=document.getElementById("ShotsAnswer"),r=document.getElementsByName("driveTrain"),m=document.getElementsByName("shootingHub"),a=document.getElementsByName("driver-rating"),c=document.getElementsByName("robot-type"),d=document.getElementsByName("isClimb"),i=document.getElementsByName("climb_bar"),l=document.getElementById("team_number_error"),s={};s.team_number=e.value,s.scouter_name=t.value,s.auton=n.value,s.shots=o.value,r.forEach(((e,t)=>{e.checked&&(s.drive_train=e.parentElement.childNodes[2].innerText)})),m.forEach(((e,t)=>{e.checked&&(s.shooting_hub=e.parentElement.childNodes[2].innerText)})),a.forEach(((e,t)=>{e.checked&&(s.driving_rating=e.parentElement.childNodes[2].innerText)})),c.forEach(((e,t)=>{e.checked&&(s.robot_type=e.parentElement.childNodes[2].innerText)})),d.forEach(((e,t)=>{e.checked&&(s.climb=e.parentElement.childNodes[2].innerText)})),i.forEach(((e,t)=>{e.checked&&(s.climb_bar=e.parentElement.childNodes[2].innerText)})),fetch("https://www.thebluealliance.com/api/v3/team/frc"+e.value,{headers:{"X-TBA-Auth-Key":""}}).then((e=>e.json())).then((e=>{e.Error?(l.innerText="Invalid Team",window.location.href="/scout/form.html#team_number_disp"):(fetch(API_ROOT+"/survey/add",{method:"POST",headers:{"Content-Type":"application/json",id:localStorage.id,password:localStorage.password},body:JSON.stringify({comp:district_key,data:s})}),window.location.href="/scout/form_finish.html")})).catch((e=>{console.error(e),l.innerText="Invalid Team",window.location.href="/scout/form.html#team_number_disp"}))};