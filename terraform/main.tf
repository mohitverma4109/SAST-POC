terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
    }
  }
}

provider "aws" {
  region = "ap-south-1"
}

# S3 Bucket - intentionally insecure for IaC scan testing
resource "aws_s3_bucket" "insecure_bucket" {
  bucket = "iac-security-test-bucket-demo"

  tags = {
    Name        = "IaC Security Test"
    Environment = "POC"
  }
}

# S3 Bucket ACL - intentionally public
resource "aws_s3_bucket_acl" "insecure_bucket_acl" {
  bucket = aws_s3_bucket.insecure_bucket.id

  acl = "public-read"
}

# Security Group - intentionally allows SSH from anywhere
resource "aws_security_group" "insecure_sg" {
  name        = "iac-insecure-security-group"
  description = "Security group for IaC scan testing"

  ingress {
    description = "SSH from anywhere"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP from anywhere"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "IaC-Security-Test"
  }
}
