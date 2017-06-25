set character set utf8;
set foreign_key_checks = 0;

insert into `mock_user`(`id`,`name`,`email`) values
('1','张三','4435534534@qq.com'),
('2','李四','4343535345@qq.com'),
('3','王五','4343535345@qq.com'),
('4','马六','4532453434@qq.com'),
('5','赵七','4542343434@qq.com'),
('6','丁八','4542343434@qq.com');


insert into `mock_role`(`id`,`name`,`description`) values
('1','Staff','职员'),
('2','Supervisor','主管'),
('3','Director','总监'),
('4','Manager','经理');


insert into `mock_user_role_r`(`id`,`user_id`,`role_id`) values
('1','1','1'),
('2','2','2'),
('3','3','2'),
('4','4','3'),
('5','5','3'),
('6','6','4');