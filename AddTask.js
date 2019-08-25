var token        = global('%TD_AUTH_TOKEN');
var task_project = task_project || global('%TD_MUMMY_PRJ');
var url          = global('%TD_API_BASE') + 'tasks';

var headers = {
  "Authorization" : "Bearer " + token,
  "X-Request-Id"  : uuid,
  "Content-Type"  : "application/json",
}

var task_project = parseInt(task_project),
  task_labels, task_priority, task_due_date;

var data_to_send = {
  content    : task_content,
  project_id : task_project,
  label_ids  : task_labels || [],
  priority   : task_priority || 1,
  due_string : task_due_date || '',
}

var data = JSON.stringify(data_to_send);

jQuery.ajax({
  type: "POST",
  url: url,
  headers: headers,
  data: data,
  success: data => {
    if (data.id) {
      setLocal("final_task_id", data.id.toString());
      setLocal("final_task_content", data.content);
    }
    flash('successfully added task "'+ data.content +'"')
  },
  error: err => {
    setLocal("error", 1);
    setLocal("errormsg", err)
    flash('error in saving task')
  },
  complete: () => exit()
});
