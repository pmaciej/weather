const getValueFromLocation = (location) =>
!location.state
  ? location.name + ' ' + location.country
  : location.name + ' ' + location.country + ' ' + location.state;

  export default getValueFromLocation;