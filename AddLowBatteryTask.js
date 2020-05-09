let token      = global('%TD_AUTH_TOKEN');
let project_id = global('%TD_PRJ_INBOX');
let base_url   = global('%TD_API_BASE');
project_id = parseInt(project_id)
// Setting variable android_bluetooth_device_extra_battery_level to bt_battery for better code
bt_battery = parseInt(bt_battery)

if (bt_battery > 30) {
  setGlobal('%TD_HEADPHONE_BATTERY_TASK', '');
}

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

let task_success = (data, responsetxt, response) => {
  if (data && data.id) {
    flash('successfully added task "'+ data.content +'"')
    setGlobal('%TD_HEADPHONE_BATTERY_TASK', data.id.toString());
  } else if (response.status == 204) {
    flash('successfully updated reminder task');
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

let update_task = (task_id) => {
  let url = base_url + 'tasks/' + task_id,
    headers = get_headers(),
    data = JSON.stringify({}),
    success = task_data => {
      if (task_data && task_data.id && !task_data.complete) {
        let content = "!! " + task_data.content.toUpperCase(),
          priority = task_data.priority + 1 <= 4 ? task_data.priority + 1 : 4;
          data_to_send = { content : content, priority: priority },
          data = JSON.stringify(data_to_send);
        make_call("POST", url, headers, data, task_success, error);
      }
    },
    error = task_error;

  make_call("GET", url, headers, {}, success, error);
}

let content = "Headset battery low - " + bt_battery + "%",
  due_string = "tod";

if (bt_battery > 0 && bt_battery <= 30) {
  let task_id = global('%TD_HEADPHONE_BATTERY_TASK');
  if (task_id) {
    update_task(task_id)
  } else {
    add_task(content, due_string);
  }
}
