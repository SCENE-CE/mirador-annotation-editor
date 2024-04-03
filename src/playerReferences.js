export const playerReferences = (function () {
  let _timeInfos;
  let _timeControls;
  let _containerWidth; // etc
  let _playerName;

  return {
    containerWidth() {
      return _containerWidth;
    },
    getTimeInfos() {
      return _timeInfos;
    },
    setTimeInfos(newTimeInfos) {
      _timeInfos = newTimeInfos;
    },
    getTimeControlFunction() {

    },
    setTimeControlFunctions() {

    },
    getPlayerType() {

    },
    setPlayerName(playerName) {
      _playerName = playerName;
    },
    getPlayerName() {
        return _playerName;
    },
  };
}());
