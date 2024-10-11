FROM mariadb:10.4.8

# Install openssl
RUN apt-get update && \
    apt-get install -y openssl && \
    apt-get install -y vim && \
    rm -rf /var/lib/apt/lists/*

# 初始化腳本（如果有）
COPY init.sql /docker-entrypoint-initdb.d/
COPY my.cnf /etc/mysql/conf.d/my.cnf
# 設置環境變量
ENV MYSQL_ROOT_PASSWORD=uNstHgqg
ENV MYSQL_DATABASE=oauth

# 暴露3306端口用於連接
EXPOSE 3306
