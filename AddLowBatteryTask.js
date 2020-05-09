let token      = global('%TD_AUTH_TOKEN');
let project_id = global('%TD_PRJ_INBOX');
let base_url   = global('%TD_API_BASE');
project_id = parseInt(project_id)
// Setting variable android_bluetooth_device_extra_battery_level to bt_battery for better code
bt_battery = parseInt(bt_battery)

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

let make_call = (type, url, headers, data, success, error) => {
  jQuery.ajax({
    type: type,
    url: url,
    headers: headers,
    data: data,
    success: success,
    error: error,
  });
}

let task_success = (data) => {
  if (data.id) {
    flash('successfully added task "'+ data.content +'"')
  } else {
    flash("some error")
  }
}

let task_error = (err) => {
  flash('error in saving task'+JSON.stringify(err))
}

let add_task = (content, due_string) => {
  let url = base_url + 'tasks',
    headers = get_headers(),
    data_to_send = { content : content, project_id : project_id, due_string : due_string },
    data = JSON.stringify(data_to_send),
    success = task_success,
    error = task_error;

  make_call("POST", url, headers, data, success, error);
}

let content = "Headset battery low - " + bt_battery + "%",
  due_string = "tod";

if (bt_battery > 0 && bt_battery < 110) {
  add_task(content, due_string);
}
