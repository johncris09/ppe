<?php

defined('BASEPATH') or exit('No direct script access allowed');

class AccountableOfficerModel extends CI_Model
{

	public $table = 'accountable_officer';

	public function __construct()
	{
		parent::__construct();
	}

	public function get()
	{
		$query = $this->db
			->select('
				accountable_officer.id, 
				accountable_officer.last_name,
				accountable_officer.first_name,
				accountable_officer.middle_name,
				accountable_officer.suffix,
				accountable_officer.assumption_date,
				accountable_officer.designation,
				accountable_officer.title,
				accountable_officer.credentials,
				office.id office_id,
				office.abbr,
				office.office  
			')
			->from($this->table)
			->join('office', 'accountable_officer.office = office.id', 'LEFT')
			->order_by('last_name ')
			->get();
		return $query->result();

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
	public function get_accountable_officers_office($data)
	{
		$query = $this->db
			->select('
			accountable_officer.id, 
			accountable_officer.last_name,
			accountable_officer.first_name,
			accountable_officer.middle_name,
			accountable_officer.suffix,
			accountable_officer.assumption_date,
			accountable_officer.designation,
			accountable_officer.title,
			accountable_officer.credentials,
			office.id office_id,
			office.abbr,
			office.office  
		')
			->from($this->table)
			->join('office', 'accountable_officer.office = office.id', 'LEFT')
			// ->where('office.id', $data['office'])
			->where($data)
			->get();
		return $query->row();
	}
	public function get_accountable_officer($data)
	{
		$query = $this->db
			->where($data)
			->get($this->table);
		return $query->result();
	}
}
