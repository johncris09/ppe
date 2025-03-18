<?php

defined('BASEPATH') or exit('No direct script access allowed');

class UserModel extends CI_Model
{

	public $table = 'users';

	public function __construct()
	{
		parent::__construct();
	}

	public function get()
	{
		$query = $this->db->get($this->table);
		return $query->result();

	}
	public function get_online()
	{
		$this->db->select('users.*, shs.school, shs.id as school_id');
		$this->db->from('users');
		$this->db->join('senior_high_school shs', 'users.school = shs.id', 'left');
		// $this->db->where('users.isLogin', 1);
		$this->db->order_by('users.isLogin, users.lastname', 'desc');
		$query = $this->db->get();
		return $query->result();

	}

	public function login($data)
	{
		$this->db->select('*');
		$this->db->from($this->table);
		$this->db->where('username', $data['username']); // Fixed array key
		$query = $this->db->get();
		$result = $query->row();


		if ($result) {

			if (md5($data['password']) == $result->password) {
				return $result; // Passwords match
			}
		}

		return false;

	}


	public function find($id)
	{
		$this->db->where('id', $id);
		$query = $this->db->get($this->table);
		return $query->row();
	}

	public function insert($data)
	{
		return $this->db->insert($this->table, $data);
	}


	public function update($id, $data)
	{
		$this->db->where('id', $id);
		return $this->db->update($this->table, $data);
	}

	public function delete($id)
	{
		return $this->db->delete($this->table, ['id' => $id]);
	}

	public function get_work_trend($data)
	{

		// $query_string = "
		// 	SELECT
		// 		total,
		// 		user_id,
		// 		encoded_at,
		// 		first_name
		// 		FROM
		// 	(SELECT
		// 		COUNT(*) AS total,
		// 		trip_ticket.`user_id`,
		// 		trip_ticket.`encoded_at`,
		// 		users.first_name
		// 	FROM
		// 		trip_ticket
		// 		LEFT JOIN users
		// 		ON users.id = trip_ticket.`user_id`
		// 	GROUP BY DATE(trip_ticket.`encoded_at`),
		// 		trip_ticket.`user_id`
		// 	UNION
		// 	ALL
		// 	SELECT
		// 		COUNT(*) AS total,
		// 		old_trip_ticket.`user_id`,
		// 		old_trip_ticket.`encoded_at`,
		// 		users.first_name
		// 	FROM
		// 		old_trip_ticket
		// 		LEFT JOIN users
		// 		ON users.id = old_trip_ticket.`user_id`
		// 	GROUP BY DATE(old_trip_ticket.`encoded_at`),
		// 		old_trip_ticket.`user_id`) t1
		// 	ORDER BY encoded_at

		// "; 
		$query_string = "
		SELECT
				COUNT(*) AS total,
				trip_ticket.`user_id`,
				trip_ticket.`encoded_at`,
				users.first_name
			FROM
				trip_ticket
				LEFT JOIN users
				ON users.id = trip_ticket.`user_id`";

		if (isset($data)) {

			$query_string .= "
			 where  date(encoded_at) ='" . $data['date'] . "' and user_id = " . $data['user_id'] . " 
		";
		}

		$query_string .= "
			GROUP BY DATE(trip_ticket.`encoded_at`),
				trip_ticket.`user_id`
		";

		return $query_string;
		$query = $this->db
			->query($query_string);


		return $query->result();
	}

	public function get_date()
	{
		$query_string = "
		
			SELECT
				DATE(encoded_at) as date
			FROM
			(SELECT
				trip_ticket.`encoded_at`
			FROM
				trip_ticket
			UNION
			ALL
			SELECT
				old_trip_ticket.`encoded_at`
			FROM
				old_trip_ticket) t1
			GROUP BY DATE(encoded_at)
		";
		$query = $this->db
			->query($query_string);


		return $query->result();
	}
}
