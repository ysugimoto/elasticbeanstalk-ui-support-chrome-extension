'use strict';


const getRegion = () => {
  const params = location.search.slice(1).split("&");
  return params.filter((e)=>{return e.startsWith("region")})[0].slice(7);
}

let popoverElement;

const popoverEnvironment = (e) => {
  const region = getRegion();
  const envId = e.target.textContent;

  const ec2_base = `/ec2/v2/home?region=${region}#Instances:tag:elasticbeanstalk:environment-id=${envId}`;
  const alb_base = `/ec2/v2/home?region=${region}#LoadBalancers:tag:elasticbeanstalk:environment-id=${envId}`;
  const asg_base = `/ec2/autoscaling/home?region=${region}#AutoScalingGroups:view=details;filter=${envId}`;

  const style = "top: " + e.pageY + "px; left: " + e.pageX + "px; min-width: 200px;";

  var element = document.createElement('div');
  element.innerHTML = (
      '<div class="popover popover-form-left bottom" id="my-popover" ng-show="instancePopover" style="' + style + '">'
      + '<div class="arrow far-left"></div>'
      + '<div class="popover-content">'
        + '<span class="ng-binding"><a href="'+ec2_base+'" target="_blank">EC2 Instances</a></span><br>'
        + '<span class="ng-binding"><a href="'+alb_base+'" target="_blank">Load Balancer</a></span><br>'
        + '<span class="ng-binding"><a href="'+asg_base+'" target="_blank">Auto Scaling Group</a></span><br>'
        + '<span class="ng-binding">CloudFormation(TBD)</span>'
      + '</div></div>'
  );
  popoverElement = document.body.appendChild(element);
};


const popoverInstance = (e) => {
  const region = getRegion();
  const insId = e.target.textContent;

  const ec2_base = `/ec2/v2/home?region=${region}#Instances:instanceId=${insId}`;
  const ssm_base = `/systems-manager/session-manager/${insId}?region=${region}`;

  const style = "top: " + (e.pageY) + "px; left: " + e.pageX + "px; min-width: 200px;";

  var element = document.createElement('div');
  element.innerHTML = (
      '<div class="popover popover-form-left top" id="my-popover" ng-show="instancePopover" style="' + style + '">'
      + '<div class="popover-content">'
        + '<span class="ng-binding"><a href="'+ec2_base+'" target="_blank">EC2 Instance</a></span><br>'
        + '<span class="ng-binding"><a href="'+ssm_base+'" target="_blank">System Manager</a></span><br>'
      + '</div></div>'
  );
  popoverElement = document.body.appendChild(element);
};

document.addEventListener("click", (e) => {
  if (popoverElement){
    document.body.removeChild(popoverElement);
    popoverElement = null;
  }

  if (e.target.getAttribute("ng-bind") === 'environment.environmentId'){
    popoverEnvironment(e);
  } else if (e.target.parentNode.getAttribute("container") === "#instance-popover") {
    popoverInstance(e);
  }
  // const envNode = document.querySelector('span[ng-bind="environment.environmentId"]');

});
