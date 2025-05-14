ECR_REGISTRY="211125625950.dkr.ecr.us-east-1.amazonaws.com/aws_manga"
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $ECR_REGISTRY
docker build -t $ECR_REGISTRY/aws_manga:latest .
docker push $ECR_REGISTRY/aws_manga:latest
