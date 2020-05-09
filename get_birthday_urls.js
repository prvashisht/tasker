const api_token = global('%PV_API_TOKEN');

let data = {
  token: api_token,
}

let set_url = url => {
  setLocal("open_url", url);
  exit();
}

$.ajax({
  type: "get",
  url: "http://www.pratyushvashisht.com/projects/tasker/messages.php?token=" + api_token,
  data: data,
  success: data => {
    flash(data);
    set_url(data);
  },
  error: err => {
    flash(err);
  }
});
