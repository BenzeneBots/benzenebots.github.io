let auth=null;const event=new CustomEvent("auth",{detail:auth}),runAuth=()=>{localStorage.id?fetch(API_ROOT+"/user/auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:localStorage.id,password:localStorage.password})}).then((t=>t.json())).then((t=>{t.user?(auth=t.user,window.dispatchEvent(event)):(window.dispatchEvent(event),localStorage.removeItem("id"),localStorage.removeItem("password"))})).catch((t=>{M.toast({text:t.message})})):window.dispatchEvent(event)};