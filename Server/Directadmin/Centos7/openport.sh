#!/bin/bash

#############################
#############################
#####_SELECT_PHP_BY_HAU_#####
#############################
#############################

iptables -A INPUT -m state --state NEW -m tcp -p tcp --dport 21 -j ACCEPT
iptables -A INPUT -m state --state NEW -m tcp -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -m state --state NEW -m tcp -p tcp --dport 23 -j ACCEPT
iptables -A INPUT -m state --state NEW -m tcp -p tcp --dport 25 -j ACCEPT
iptables -A INPUT -m state --state NEW -m tcp -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -m state --state NEW -m tcp -p tcp --dport 2222 -j ACCEPT
service iptables save
systemctl restart iptables
echo "Open Port Thanh Cong!"

cd /usr/sbin
mv setquota setquota.old
touch setquota
chmod 755 setquota
echo "Sua Loi Set Quota Directadmin Thanh Cong!"
