import $ from "cash-dom";
import { validateUserName } from "./validate";
import { doFetch } from "./fetch";
import { formatDate } from "./helpers";
import "./assets/scss/app.scss";

export class App {
  constructor() {
    this.userName = "";
    this.history = [];
    this.userTimeline = $("#user-timeline");
    this.isLoading = false;
    this.userProfile = $("#user-profile");
    this.loader = $("#spinner");
  }

  getUserEvents(userName) {
    doFetch(userName + "/events/public")
      .then((data) => {
        this.history = data;
        if (data.length > 0) {
          return this.updateHistory();
        }
        this.loader.addClass("isHidden");
        this.userTimeline.removeClass("is-hidden");
        return false;
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
    if (specificEvents.length > 0) {
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
                    <p><a id="timeline-author" href=https://github.com/${
                      event.actor.login
                    }>${event.actor.display_login}</a> ${
          event.payload.action
        } <a
                        href=${
                          event.payload.pull_request._links.html.href
                        }>pull request</a></p>
                    <p class="repo-name">
                      <a href=https://github.com/${event.repo.name}>${
          event.repo.name
        }</a>
                    </p>
                  </div>
                </div>
  
              </div>
            </div>
        `;
        this.loader.addClass("is-hidden");
        $(template).appendTo(this.userTimeline);
      });
    }
    this.loader.addClass("is-hidden");
    this.userTimeline.removeClass("is-hidden");
    return false;
  }

  initializeApp() {
    $(".load-username").on("click", () => {
      this.userName = $("#username").val();
      if (validateUserName(this.userName)) {
        this.loader.removeClass("is-hidden");
        this.userTimeline.addClass("is-hidden");
        this.userProfile.addClass("is-hidden");
        return doFetch(this.userName)
          .then((body) => {
            $("#username").removeClass("is-danger");
            this.profile = body;
            this.getUserEvents(this.userName);
            return this.updateProfile();
          })
          .catch((error) => {
            this.loader.removeClass("isHidden");
            this.userTimeline.removeClass("is-hidden");
            this.userProfile.removeClass("is-hidden");
            console.log("network error", error);
            $("#username").addClass("is-danger");
          });
      }
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
    this.userProfile.removeClass("is-hidden");
  }
}
