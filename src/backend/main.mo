import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import InviteLinksModule "invite-links/invite-links-module";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Random "mo:core/Random";
import Time "mo:core/Time";

actor {
  // Authorization system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Invite links system
  let inviteState = InviteLinksModule.initState();

  // Feedback response type
  type FeedbackResponse = {
    name : Text;
    rating : Nat;
    category : Text;
    feedback : Text;
    timestamp : Time.Time;
  };

  // Feedback statistics type
  type FeedbackStats = {
    totalResponses : Nat;
    averageRating : Float;
  };

  // State variables for feedback responses
  let responses = Map.empty<Principal, FeedbackResponse>();

  // Submit feedback response
  public shared ({ caller }) func submitFeedback(name : Text, rating : Nat, category : Text, feedback : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit feedback");
    };

    if (rating < 1 or rating > 5) {
      Runtime.trap("Rating must be between 1 and 5");
    };

    let response : FeedbackResponse = {
      name;
      rating;
      category;
      feedback;
      timestamp = Time.now();
    };
    responses.add(caller, response);
  };

  // Get all feedback responses
  public query ({ caller }) func getAllResponses() : async [FeedbackResponse] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all responses");
    };
    responses.values().toArray();
  };

  // Get feedback statistics
  public query ({ caller }) func getFeedbackStats() : async FeedbackStats {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view statistics");
    };
    let responsesArray = responses.values().toArray();
    let count = responsesArray.size();
    var totalRating = 0;
    responsesArray.forEach(func (response) { totalRating += response.rating });
    let averageRating = if (count == 0) { 0.0 } else { totalRating.toFloat() / count.toFloat() };
    {
      totalResponses = count;
      averageRating;
    };
  };

  // Generate invite code (admin only)
  public shared ({ caller }) func generateInviteCode() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can generate invite codes");
    };
    let blob = await Random.blob();
    let code = InviteLinksModule.generateUUID(blob);
    InviteLinksModule.generateInviteCode(inviteState, code);
    code;
  };

  // Submit RSVP (public, but requires valid invite code)
  public shared func submitRSVP(name : Text, attending : Bool, inviteCode : Text) : async () {
    InviteLinksModule.submitRSVP(inviteState, name, attending, inviteCode);
  };

  // Get all RSVPs (admin only)
  public query ({ caller }) func getAllRSVPs() : async [InviteLinksModule.RSVP] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view RSVPs");
    };
    InviteLinksModule.getAllRSVPs(inviteState);
  };

  // Get all invite codes (admin only)
  public query ({ caller }) func getInviteCodes() : async [InviteLinksModule.InviteCode] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view invite codes");
    };
    InviteLinksModule.getInviteCodes(inviteState);
  };
};
