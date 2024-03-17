import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';

export class VPCStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const { appName, env } = props!.env!;

    const vpc = new ec2.Vpc(this, `${appName}-VPC-${env}`, {
      createInternetGateway: true,
      maxAzs: 2,
      vpcName: `${appName}-VPC-${env}`,
      enableDnsSupport: true,
      enableDnsHostnames: true,
      restrictDefaultSecurityGroup: false,
      subnetConfiguration: [
        {
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 26,
          name: `${appName}-Public-Subnet`,
        },
        {
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 26,
          name: `${appName}-Protected-Subnet`,
        },
        {
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 26,
          name: `${appName}-Private-Subnet`,
        },
      ],
    });

    // Create a Security Group for Public Subnet
    const publicSg = new ec2.SecurityGroup(this, `PublicSecurityGroup-${env}`, {
      vpc: vpc,
      securityGroupName: `PublicSecurityGroup-${env}`,
      description: 'Allow ssh access to ec2 instances',
      allowAllOutbound: true,
    });
    publicSg.addIngressRule(
      ec2.Peer.anyIpv4(), // Allow traffic from all IP addresses
      ec2.Port.tcp(80),
      'Allow 80 inbound traffic',
    );

    // Create a Security Group for Protected Subnet
    const protectedSg = new ec2.SecurityGroup(this, `ProtectedSecurityGroup-${env}`, {
      vpc: vpc,
      securityGroupName: `ProtectedSecurityGroup-${env}`,
      description: 'Allow all traffic from public security group',
    });

    protectedSg.addIngressRule(publicSg, ec2.Port.tcp(3000), 'Allow 3000 inbound traffic');

    // Create a Security Group for Protected Subnet
    const privateSg = new ec2.SecurityGroup(this, `PrivateSecurityGroup-${env}`, {
      vpc: vpc,
      securityGroupName: `PrivateSecurityGroup-${env}`,
      description: 'Allow 5432 from protected security group',
    });

    privateSg.addIngressRule(protectedSg, ec2.Port.tcp(5432), 'Allow 5432 inbound traffic');

    new rds.SubnetGroup(this, `SubnetGroup-${env}`, {
      vpc: vpc,
      subnetGroupName: `SubnetGroup-${env}`,
      description: `SubnetGroup-${env}`,
      vpcSubnets: { subnets: vpc.isolatedSubnets },
    });

    // ====================================================
    // NAT Gatewayを使用する場合は、下記の4つのEndPointが不要
    // ====================================================
    // Create ECR API Interface Endpoint
    //   const logEndpoint = new ec2.InterfaceVpcEndpoint(this, `EcrLog-${env}`, {
    //     vpc: vpc,
    //     service: ec2.InterfaceVpcEndpointAwsService.CLOUDWATCH_LOGS,
    //     subnets: { subnets: vpc.privateSubnets },
    //     securityGroups: [protectedSg],
    //   });

    //   cdk.Tags.of(logEndpoint).add('Name', `EcrLog-${env}`);

    //   // Create S3 Gateway Endpoint
    //   const s3Endpoint = new ec2.GatewayVpcEndpoint(this, `S3Endpoint-${env}`, {
    //     vpc: vpc,
    //     service: ec2.GatewayVpcEndpointAwsService.S3,
    //     subnets: [
    //       {
    //         subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
    //       },
    //     ],
    //   });
    //   cdk.Tags.of(s3Endpoint).add('Name', `S3Endpoint-${env}`);

    //   // Create ECR API Interface Endpoint
    //   const ecrApiEndpoint = new ec2.InterfaceVpcEndpoint(this, `EcrApiEndpoint-${env}`, {
    //     vpc: vpc,
    //     service: ec2.InterfaceVpcEndpointAwsService.ECR,
    //     subnets: { subnets: vpc.privateSubnets },
    //     securityGroups: [protectedSg],
    //   });
    //   cdk.Tags.of(ecrApiEndpoint).add('Name', `EcrApiEndpoint-${env}`);

    //   // Create ECR DKR Interface Endpoint
    //   const ecrDkrEndpoint = new ec2.InterfaceVpcEndpoint(this, `EcrDkrEndpoint-${env}`, {
    //     vpc: vpc,
    //     service: ec2.InterfaceVpcEndpointAwsService.ECR_DOCKER,
    //     subnets: { subnets: vpc.privateSubnets },
    //     securityGroups: [protectedSg],
    //   });
    //   cdk.Tags.of(ecrDkrEndpoint).add('Name', `EcrDkrEndpoint-${env}`);
  }
}
