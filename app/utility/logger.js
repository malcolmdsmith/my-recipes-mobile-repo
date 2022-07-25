import Bugsnag from "@bugsnag/expo";

function log(error) {
  Bugsnag.notify(error);
}

//const start = () => Bugsnag.start();

export default { log };
