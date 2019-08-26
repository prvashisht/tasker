var main = require("./main")
var $ = main.jQuery;
var global = main.global;
var setLocal = main.setLocal;
var exit = main.exit;
var flash = main.flash;
var antext = main.dummy_notification;

let token      = global('%TD_AUTH_TOKEN');
let project_id = global('%TD_MUMMY_PRJ');
let base_url   = global('%TD_API_BASE');
project_id = parseInt(project_id)

let added_task = {};

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

let set_sms_text = (sms_text) => {
  setLocal("sms_text", sms_text);
  exit();
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

let comment_success = (data) => {
  let sms_text = `Adding was successful. Following was added:

  Task: ${added_task.content},
  ID: ${added_task.id},
  Comment: ${data.content}
  `;
  flash('success fully added comment');
  set_sms_text(sms_text);
}

let comment_error = (err) => {
  let sms_text = `Added the following task with ID ${added_task.id}.

  ${added_task.content}

  Adding comment was not successful. Error:

  ${err}`;
  flash("Added task, couldn't add comment");
  set_sms_text(sms_text);
}

let add_comment = () => {
  if (comment) {
    let url = base_url + "comments",
      headers = get_headers(),
      data = JSON.stringify({ task_id: added_task.id, content: comment }),
      success = comment_success,
      error = comment_error;
    make_call("POST", url, headers, data, success, error);
  } else {
    let sms_text = `Adding was successful. The following task was added with ID ${added_task.id}:

    ${added_task.content}`;
    set_sms_text(sms_text);
  }
}

let task_success = (data) => {
  if (data.id) {
    added_task = { ...data };
    flash('successfully added task "'+ data.content +'"')
    add_comment()
  } else {
    let sms_text = "Adding was not successful. Unknown error";
    set_sms_text(sms_text);
  }
}

let task_error = (err) => {
  let sms_text = `Adding was not successful. Error is:

    ${err}
  `;
  flash('error in saving task')
  set_sms_text(sms_text);
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

let task = antext.split('\n'),
  content = task[0].split("Todoist:")[1],
  due_string = task[1] || '',
  comment = task[2] || '';
add_task(content, due_string);
