set character set utf8;
SET foreign_key_checks = 0;

drop table if exists `mock_user`;
create table `mock_user` (
    `id` varchar(50) not null primary key comment '主键',
    `name` varchar(40) not null  comment '名称',
    `email` varchar(80)   comment '邮件'
) engine=innodb default charset=utf8 comment='用户';

drop table if exists `mock_role`;
create table `mock_role` (
    `id` varchar(50) not null primary key comment '主键',
    `name` varchar(40) not null  comment '名称',
    `description` varchar(200)   comment '角色描述'
) engine=innodb default charset=utf8 comment='角色';

drop table if exists `mock_user_role_r`;
create table `mock_user_role_r` (
    `id` varchar(50) not null primary key comment '主键',
    `user_id` varchar(50) not null   comment '用户ID',
    `role_id` varchar(50) not null  comment '角色ID'
) engine=innodb default charset=utf8 comment='用户角色关联表';