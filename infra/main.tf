resource "aws_vpc" "main"{
    cider_block = var.vpc_cider
    instance_tenancy = "default"

    tags = {
        Name = var.vpc_name
    }
}