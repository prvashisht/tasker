let token      = global('%TD_AUTH_TOKEN');
let project_id = global('%TD_PRJ_INBOX');
let base_url   = global('%TD_API_BASE');
project_id = parseInt(project_id)

flash(android_bluetooth_device_extra_battery_level);

if (android_bluetooth_device_extra_battery_level > 70)
  return;

let get_uuid = () => {
  let d = new Date().getTime();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
}

let get_headers = () => {
  return {
    "Authorization" : "Bearer " + token,
    "X-Request-Id"  : get_uuid(),
    "Content-Type"  : "application/json",
  };
}

if (android_bluetooth_device_extra_battery_level > 0 && android_bluetooth_device_extra_battery_level < 50) {
  let task = "Headset battery low - " + android_bluetooth_device_extra_battery_level + "%",
    url = base_url + "tasks",
    data_to_send = { content : task, project_id : project_id, due_string : "tod" },
    data = JSON.stringify(data_to_send);

  $.ajax({
    type: "POST",
    url: url,
    headers: get_headers(),
    data: data,
    success: data => console.log(data),
    error: err => console.log(err),
  })
}
