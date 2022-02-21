const AWS = require('aws-sdk');

module.exports = {
  async createNekoRooms ({ aws_region, aws_access_key_id, aws_secret_access_key, instanceParams = {}, token}) {
    // Load credentials and set region from JSON file
    AWS.config.update({
      accessKeyId: aws_access_key_id,
      secretAccessKey: aws_secret_access_key,
      region: aws_region
    });

    // Create EC2 service object
    const ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });

    // AMI is amzn-ami-2011.09.1.x86_64-ebs
    const instanceParams = Object.assign({
        ImageId: 'ami-08ca3fed11864d6bb', 
        InstanceType: 't2.large',
        MinCount: 1,
        MaxCount: 1,
        userData: `
          curl -sL -H "Authorization: Bearer ${token}" https://api-codx.meetnav.com/api/neko-rooms/installer
        `
      }, instanceParams)

    // Create a promise on an EC2 service object
    var instancePromise = new AWS.EC2({apiVersion: '2016-11-15'}).runInstances(instanceParams).promise();

    // Handle promise's fulfilled/rejected states
    instancePromise.then(
      function(data) {
        console.log(data);
        var instanceId = data.Instances[0].InstanceId;
        console.log("Created instance", instanceId);
        // Add tags to the instance
        tagParams = {Resources: [instanceId], Tags: [
          {
              Key: 'Name',
              Value: 'SDK Sample'
          }
        ]};
        // Create a promise on an EC2 service object
        var tagPromise = new AWS.EC2({apiVersion: '2016-11-15'}).createTags(tagParams).promise();
        // Handle promise's fulfilled/rejected states
        tagPromise.then(
          function(data) {
            console.log("Instance tagged");
          }).catch(
            function(err) {
            console.error(err, err.stack);
          });
      }).catch(
        function(err) {
        console.error(err, err.stack);
      });
  }
}