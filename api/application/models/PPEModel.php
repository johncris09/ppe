<?php

defined('BASEPATH') or exit('No direct script access allowed');

class PPEModel extends CI_Model
{

	public $table = 'ppe';

	public function __construct()
	{
		parent::__construct();
	}

	public function get()
	{

		$query = $this->db
			->select('
				ppe.id,
				ppe.accountable_officer,
				ppe.article,
				ppe.description,
				ppe.date_acquired,
				ppe.stock_number,
				ppe.unit,
				ppe.value,
				ppe.balance_per_card,
				ppe.onhand_per_count,
				ppe.shortage_quantity,
				ppe.storage_value,
				ppe.end_user,
				ppe.remarks,
				ppe.encoded_by,

				equipment_type.id equipment_type_id,
				equipment_type.equipment_type,
				equipment_type.code,

				accountable_officer.id accountable_officer_id, 
				accountable_officer.last_name accountable_officer_last_name,
				accountable_officer.first_name accountable_officer_first_name,
				accountable_officer.middle_name accountable_officer_middle_name,
				accountable_officer.suffix accountable_officer_suffix,
				accountable_officer.assumption_date,
				accountable_officer.designation,
				accountable_officer.title,
				accountable_officer.credentials,
				office.id office_id,
				office.abbr,
				office.office,

				users.first_name users_first_name,
				users.last_name users_last_name,
				users.middle_name users_middle_name,
				users.username users_username,
				users.password users_password,
				users.role_type users_role_type 


			')
			->from($this->table)
			->join('equipment_type', 'ppe.equipment_type = equipment_type.id', 'LEFT')
			->join('accountable_officer', 'ppe.accountable_officer = accountable_officer.id', 'LEFT')
			->join('office', 'accountable_officer.office = office.id', 'LEFT')
			->join('users', 'ppe.encoded_by = users.id', 'LEFT')
			->order_by('ppe.date_acquired desc')
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
	public function get_office_equipment_type($data)
	{

		$query = $this->db
			->select(' distinct(equipment_type) ')
			->where($data)
			->get($this->table);
		return $query->result();
	}

	public function get_item($data)
	{
		$query = $this->db
			->select('
				ppe.id,
				ppe.accountable_officer,
				ppe.article,
				ppe.description,
				ppe.date_acquired,
				ppe.stock_number,
				ppe.unit,
				ppe.value,
				ppe.balance_per_card,
				ppe.onhand_per_count,
				ppe.shortage_quantity,
				ppe.storage_value,
				ppe.end_user,
				ppe.remarks,
				ppe.encoded_by,

				equipment_type.id equipment_type_id,
				equipment_type.equipment_type,
				equipment_type.code,

				accountable_officer.id accountable_officer_id, 
				accountable_officer.last_name accountable_officer_last_name,
				accountable_officer.first_name accountable_officer_first_name,
				accountable_officer.middle_name accountable_officer_middle_name,
				accountable_officer.suffix accountable_officer_suffix,
				accountable_officer.assumption_date,
				accountable_officer.designation,
				accountable_officer.title,
				accountable_officer.credentials,
				office.id office_id,
				office.abbr,
				office.office,

				users.first_name users_first_name,
				users.last_name users_last_name,
				users.middle_name users_middle_name,
				users.username users_username,
				users.password users_password,
				users.role_type users_role_type 


			')
			->from($this->table)
			->join('equipment_type', 'ppe.equipment_type = equipment_type.id', 'LEFT')
			->join('accountable_officer', 'ppe.accountable_officer = accountable_officer.id', 'LEFT')
			->join('office', 'accountable_officer.office = office.id', 'LEFT')
			->join('users', 'ppe.encoded_by = users.id', 'LEFT')
			->where($data)
			->order_by('ppe.date_acquired desc')
			->get();
		return $query->result();
	}

}
