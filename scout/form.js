const submit_form=()=>{let e=document.getElementById("team_number"),t=document.getElementById("scouter_name"),n=document.getElementById("AutonAnswer"),o=document.getElementById("ShotsAnswer"),d=document.getElementsByName("driveTrain"),c=document.getElementsByName("shootingHub"),m=document.getElementsByName("driver-rating"),r=document.getElementsByName("robot-type"),a=document.getElementsByName("isClimb"),i=document.getElementsByName("climb_bar"),l={};l.team_number=e.value,l.scouter_name=t.value,l.auton=n.value,l.shots=o.value,d.forEach(((e,t)=>{e.checked&&(l.drive_train=e.parentElement.childNodes[2].innerText)})),c.forEach(((e,t)=>{e.checked&&(l.shooting_hub=e.parentElement.childNodes[2].innerText)})),m.forEach(((e,t)=>{e.checked&&(l.driving_rating=e.parentElement.childNodes[2].innerText)})),r.forEach(((e,t)=>{e.checked&&(l.robot_type=e.parentElement.childNodes[2].innerText)})),a.forEach(((e,t)=>{e.checked&&(l.climb=e.parentElement.childNodes[2].innerText)})),i.forEach(((e,t)=>{e.checked&&(l.climb_bar=e.parentElement.childNodes[2].innerText)})),fetch(API_ROOT+"/survey/add",{method:"POST",headers:{"Content-Type":"application/json",id:localStorage.id,password:localStorage.password},body:JSON.stringify({comp:district_key,data:l})})};