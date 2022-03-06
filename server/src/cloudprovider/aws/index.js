module.exports = ({ aws_region, aws_access_key_id, aws_secret_access_key }) => {
  const AWS = require('aws-sdk');
  // Load credentials and set region from JSON file
  AWS.config.update({
    accessKeyId: aws_access_key_id,
    secretAccessKey: aws_secret_access_key,
    region: aws_region
  });
  console.log("Create AWS provider", { aws_region, aws_access_key_id, aws_secret_access_key })
  return {
    async createNekoRooms ({ token}) {
      const userData = `
      curl -sL -H "Authorization: Bearer ${token}" https://api-codx.meetnav.com/api/neko-rooms/installer
    `
      return this.createRoom({ userData })
    },
    async createRoom (settings) {
      console.log("AWS", "create vps", settings)
      const { UserData } = settings
      // Create EC2 service object
      const ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });

      // AMI is amzn-ami-2011.09.1.x86_64-ebs
      const instanceParams = Object.assign({
          ImageId: 'ami-08ca3fed11864d6bb', 
          InstanceType: 't2.large',
          MinCount: 1,
          MaxCount: 1,
          UserData
        }, instanceParams)

      // Create a promise on an EC2 service object
      const runInstance = ec2.runInstances(instanceParams);
      
      // Handle promise's fulfilled/rejected states
      const { Instances: [instance] } = await runInstance.promise()
      console.log("Created instance", instance);
      tagParams = {
        Resources: [instance.InstanceId],
        Tags: [
          {
              Key: 'Name',
              Value: 'codx-instance'
          }
      ]}
      // Create a promise on an EC2 service object
      var tagPromise = ec2.createTags(tagParams)
      // Handle promise's fulfilled/rejected states
      await tagPromise.promise()
      return {
        instanceParams,
        data,
        tagParams
      }
    }
  }
}