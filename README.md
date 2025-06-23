# 🚀 End-to-End Express App Deployment using Ansible, Docker, and Nginx on AWS

This project demonstrates a complete infrastructure-as-code and CI/CD setup to deploy a minimal Express.js application in a production-like environment. It uses **AWS EC2**, **Docker**, **Nginx**, and **Ansible**, with automated deployment via **GitHub Actions**.

---

## 🔧 Tech Stack

| Layer              | Tool/Service                        |
|-------------------|-------------------------------------|
| App               | Node.js + Express (`/ping` route)   |
| Containerization  | Docker                              |
| Infra Provision   | Ansible EC2 Modules (manual run)    |
| Configuration     | Ansible Roles & Jinja Templates     |
| Load Balancing    | Nginx (on separate EC2)             |
| CI/CD             | GitHub Actions                      |
| Cloud Platform    | AWS EC2                             |

---

## 🌐 Architecture Overview

```text
                    ┌────────────┐
                    │ GitHub Repo│
                    └────┬───────┘
                         │
                ┌────────▼────────┐
                │ GitHub Actions  │
                └────┬───────┬────┘
                     │       │
             ┌───────▼─┐ ┌───▼─────────┐
             │ Ansible │ │ .pem + IPs  │
             │ Roles   │ │ from Secrets│
             └────┬────┘ └─────┬───────┘
                  ▼           ▼
         ┌───────────────────────────┐
         │ EC2: web-1  | Express + Docker │
         │ EC2: web-2  | Express + Docker │
         └────────┬──────────────────────┘
                  ▼
         ┌──────────────────────────┐
         │ EC2: Nginx Load Balancer │
         └──────────────────────────┘


---

## 🖥️ Express App

A simple / route that responds from each server individually:

app.get("/", (req, res) => {
	res.json({
		msg: `i am healthy - ${process.env.SERVER_NAME || "no-name"}`,
		ip: ip.address(),
	});
});
The response changes depending on which EC2 instance handled the request, and SERVER_NAME is injected via Docker environment variables.

---

## 🐳 Docker

Each app server builds and runs a Docker container locally (no registry used). The container is built from the GitHub repo using the included Dockerfile.

---

## ⚙️ EC2 Provisioning with Ansible

Provisioning was done manually using the amazon.aws.ec2_instance module. Instances created:

web1, web2: App servers running Express in Docker

load-balancer: Nginx reverse proxy server

Each instance was launched with required tags and SSH keys. After launch, a Jinja2 template generates inventory.ini dynamically using the extracted public IPs.


---

## 📦 Ansible Roles

### node-app Role

- Installs Docker and Git

- Clones GitHub repository on EC2

- Builds the Docker image from /app directory

- Runs container with port binding and environment variables

### nginx Role

- Installs and starts Nginx

- Uses Jinja2 templated nginx.conf.j2 to configure reverse proxy to both app servers

- Applies config and restarts the service


---

## 🧠 Jinja2 Template Usage

The Nginx config dynamically includes backend app server IPs using this logic:

upstream express_app {
  {% for host in groups['app_servers'] %}
  server {{ host }}:3000;
  {% endfor %}
}

This ensures Nginx always reverse proxies to the correct EC2 IPs listed in the app_servers group.


--- 

## 🔁 GitHub Actions CI/CD

The deployment pipeline is triggered via workflow_dispatch and performs the following:

- Installs Ansible

- Recreates .pem file securely from GitHub Secrets

- Injects EC2 IPs into inventory.ini using GitHub Secrets

- Runs Ansible playbook.yml to:

    - SSH into app servers and rebuild Docker containers

    - SSH into load balancer and reload Nginx


---

## 🔐 GitHub Secrets Used

- SSH_PRIVATE_KEY: contents of .pem file

- APP_SERVER_1, APP_SERVER_2: public IPs of EC2 app instances

- LOAD_BALANCER_IP: public IP of Nginx EC2 instance


---

## ✅ Deployment Outcome

- Two EC2 servers (web1, web2) each running an Express app in Docker

- One EC2 load balancer running Nginx, reverse-proxying traffic to both app instances

- Fully automated CI/CD pipeline from GitHub

- Uses SSH, Docker, Ansible Roles, Jinja2, and EC2 modules — no hardcoded secrets or IPs


---

## 🔐 Security Notes

- .pem is never committed to the repo; passed via GitHub Secrets only

- EC2 instance IPs are also passed through GitHub Secrets

- No use of Ansible Vault in this project

- Inventory and key setup are handled securely and dynamically


---

## 👨‍💻 Author

Tushar Baweja

🔗 [GitHub](https://github.com/tusharb05) • 📨 [tbaweja786@gmail.com](mailto:tbaweja786@gmail.com)

🎯 Backend | DevOps | Systems | Passionate about scalable backend infra