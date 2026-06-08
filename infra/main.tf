resource "aws_vpc" "vpc"{
    cidr_block = var.vpc_cidr
    instance_tenancy = "default"

    tags = {
        Name = var.vpc_name
    }
}

resource "aws_subnet" "sb" {
  vpc_id     = aws_vpc.vpc.id
  cidr_block = "10.0.1.0/24"

  tags = {
    Name = "Main"
  }
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.vpc.id

  tags = {
    Name = "main"
  }
}

resource "aws_route_table" "rt" {
  vpc_id = aws_vpc.vpc.id

  route = []

  tags = {
    Name = "example"
  }
}

resource "aws_route" "r" {
  route_table_id            = aws_route_table.rt.id
  destination_cidr_block    = "0.0.0.0/0"
}

resource "aws_route_table_association" "example" {
  subnet_id      = aws_subnet.sb.id
  route_table_id = aws_route_table.rt.id
}