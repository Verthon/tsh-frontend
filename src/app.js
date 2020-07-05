import $ from "cash-dom";
import { validateUserName } from "./validate";
import { doFetch } from "./fetch";
import { formatDate } from './helpers'
import "./assets/scss/app.scss";

export class App {
  constructor() {
    this.userName = "";
    this.history = [];
    this.initializeApp = this.initializeApp.bind(this);
    this.userTimeline = $("#user-timeline");
    this.isLoading = false;
  }

  getUserEvents(userName) {
    doFetch(userName + "/events/public")
      .then((data) => {
        this.history = data;
        return this.updateHistory();
      })
      .catch((error) => console.log("error", error));
  }

  updateHistory() {
    const requiredEventTypes = [
      "PullRequestEvent",
      "PullRequestReviewCommentEvent",
    ];
    const specificEvents = this.history.filter((event) =>
      requiredEventTypes.includes(event.type)
    );
    this.userTimeline.empty();
    specificEvents.forEach((event) => {
      const template = `
      <div class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <p class="heading">${formatDate(event.created_at)}</p>

              <div class="history-content">
                <figure class="timeline-avatar image is-32x32">
                  <img src=${event.actor.avatar_url} id="timeline-img"/>
                </figure>
                <div class="media-content">
                  <p><a id="timeline-author" href=https://github.com/${event.actor.login}>${event.actor.display_login}</a> ${event.payload.action} <a
                      href=${event.payload.pull_request._links.html.href}>pull request</a></p>
                  <p class="repo-name">
                    <a href=https://github.com/${event.repo.name}>${event.repo.name}</a>
                  </p>
                </div>
              </div>

            </div>
          </div>
      `;
      $(template).appendTo(this.userTimeline);
    });
  }

  initializeApp() {
    let self = this;

    $(".load-username").on("click", function (e) {
      self.isLoading = true;
      self.userName = $("#username").val();
      if (validateUserName(self.userName)) {
        return doFetch(self.userName)
          .then((body) => {
            $("#username").removeClass("is-danger");
            self.profile = body;
            self.getUserEvents(self.userName);
            return self.updateProfile();
          })
          .catch((error) => {
            this.isLoading = false;
            console.log("network error", error);
            $("#username").addClass("is-danger");
          });
      }
      this.isLoading = false;
      $("#username").addClass("is-danger");
    });
  }

  updateProfile() {
    $("#profile-name").text($("#username").val());
    $("#profile-image").attr("src", this.profile.avatar_url);
    $("#profile-url")
      .attr("href", this.profile.html_url)
      .text(this.profile.login);
    $("#profile-bio").text(this.profile.bio || "(no information)");
    this.isLoading = false;
  }
}
