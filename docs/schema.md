## Database Schema

### Users

| Column Name    | Data Type      | Details        |
| :------------- | :------------- | :------------- |
| id             | integer        | not null, primary key       |
| username       | string         | not null, unique       |
| last_online    | datetime       | not null       |
| created_at     | datetime       | not null       |
| updated_at     | datetime       | not null       |

### Channels

| Column Name    | Data Type      | Details        |
| :------------- | :------------- | :------------- |
| id             | integer        | not null, primary key       |
| title          | string         | not null, unique       |
| last_online    | datetime       | not null       |
| created_at     | datetime       | not null       |
| updated_at     | datetime       | not null       |

### Memberships

| Column Name    | Data Type      | Details        |
| :------------- | :------------- | :------------- |
| id             | integer        | not null, primary key       |
| user_id        | integer        | not null, unique       |
| channel_id     | integer        | not null       |
| created_at     | datetime       | not null       |
| updated_at     | datetime       | not null       |

### Messages

| Column Name    | Data Type      | Details        |
| :------------- | :------------- | :------------- |
| id             | integer        | not null, primary key       |
| body           | string         | not null       |
| author_id      | integer        | not null, indexed      |
| channel_id     | integer        | not null, indexed      |
| created_at     | datetime       | not null       |
| updated_at     | datetime       | not null       |
