import $ from "cash-dom";
import { validateUserName } from "./validate";
import { doFetch } from "./fetch";
import "./assets/scss/app.scss";

export class App {
  constructor() {
    this.initializeApp = this.initializeApp.bind(this);
  }
  initializeApp() {
    let self = this;

    $(".load-username").on("click", function (e) {
      let userName = $("#username").val();
      if (validateUserName(userName)) {
        return doFetch(userName).then((body) => {
          $("#username").removeClass("is-danger");
          self.profile = body;
          return self.update_profile();
        }).catch((error) => {
          console.log('network error', error)
          $("#username").addClass("is-danger");
        })
      }
      $("#username").addClass("is-danger");
    });
  }

  update_profile() {
    $("#profile-name").text($("#username").val());
    $("#profile-image").attr("src", this.profile.avatar_url);
    $("#profile-url")
      .attr("href", this.profile.html_url)
      .text(this.profile.login);
    $("#profile-bio").text(this.profile.bio || "(no information)");
  }
}
